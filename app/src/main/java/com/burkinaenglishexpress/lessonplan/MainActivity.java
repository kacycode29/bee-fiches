package com.burkinaenglishexpress.lessonplan;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebViewAssetLoader;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Affiche le contenu HTML local (app/src/main/assets) dans une WebView.
 *
 * Les fichiers sont servis via https://appassets.androidplatform.net/ plutôt
 * qu'en file:// — c'est une vraie origine sécurisée, donc localStorage,
 * IndexedDB et les modules JavaScript fonctionnent normalement, hors ligne.
 */
public class MainActivity extends AppCompatActivity {

    /** Page d'accueil dans le dossier assets. */
    private static final String START_PAGE =
            "https://appassets.androidplatform.net/assets/index.html";

    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private ActivityResultLauncher<Intent> fileChooserLauncher;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        fileChooserLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (filePathCallback == null) return;
                    Uri[] uris = null;
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        String dataString = result.getData().getDataString();
                        if (dataString != null) {
                            uris = new Uri[]{Uri.parse(dataString)};
                        }
                    }
                    filePathCallback.onReceiveValue(uris);
                    filePathCallback = null;
                });

        webView = new WebView(this);
        setContentView(webView);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // localStorage / sessionStorage
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);           // inutile : tout passe par l'AssetLoader
        s.setAllowContentAccess(false);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setBuiltInZoomControls(true);
        s.setDisplayZoomControls(false);
        s.setSupportZoom(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setJavaScriptCanOpenWindowsAutomatically(true);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false);

        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .addPathHandler("/res/", new WebViewAssetLoader.ResourcesPathHandler(this))
                .build();

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost();
                // Le contenu local reste dans l'application…
                if (host != null && host.equals("appassets.androidplatform.net")) {
                    return false;
                }
                // …les liens externes (http, mailto:, tel:) partent vers le système.
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (ActivityNotFoundException e) {
                    toast("Aucune application ne peut ouvrir ce lien.");
                }
                return true;
            }

            // Android 5.x / 6.0 : ancienne signature
            @Override
            @SuppressWarnings("deprecation")
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Uri uri = Uri.parse(url);
                String host = uri.getHost();
                if (host != null && host.equals("appassets.androidplatform.net")) {
                    return false;
                }
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (ActivityNotFoundException e) {
                    toast("Aucune application ne peut ouvrir ce lien.");
                }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                injectBridgeScript();
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view,
                                             ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = callback;
                try {
                    fileChooserLauncher.launch(params.createIntent());
                    return true;
                } catch (ActivityNotFoundException e) {
                    filePathCallback = null;
                    toast("Aucun gestionnaire de fichiers disponible.");
                    return false;
                }
            }
        });

        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");

        // Téléchargements déclenchés par la page (blob:, data:, ou fichier distant)
        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, length) -> {
            if (url.startsWith("blob:")) {
                webView.evaluateJavascript(blobToBase64Script(url, mimeType), null);
            } else if (url.startsWith("data:")) {
                saveDataUrl(url, null);
            } else {
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                } catch (ActivityNotFoundException e) {
                    toast("Téléchargement impossible.");
                }
            }
        });

        // Bouton retour : naviguer dans l'historique de la page avant de quitter
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                }
            }
        });

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(START_PAGE);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    /**
     * Redirige window.print() vers le service d'impression Android
     * (qui propose aussi « Enregistrer au format PDF ») et mémorise le nom
     * de fichier suggéré par les liens <a download="...">.
     */
    private void injectBridgeScript() {
        String js =
            "(function(){" +
            "  if (window.__androidBridgeReady) return;" +
            "  window.__androidBridgeReady = true;" +
            "  window.print = function(){ AndroidBridge.printPage(document.title || ''); };" +
            "  var ac = HTMLAnchorElement.prototype.click;" +
            "  HTMLAnchorElement.prototype.click = function(){" +
            "    try { if (this.hasAttribute('download'))" +
            "      window.__lastDownloadName = this.getAttribute('download') || '';" +
            "    } catch (err) {}" +
            "    return ac.apply(this, arguments);" +
            "  };" +
            "  document.addEventListener('click', function(e){" +
            "    var t = e.target;" +
            "    while (t && t !== document) {" +
            "      if (t.tagName === 'A' && t.hasAttribute('download')) {" +
            "        window.__lastDownloadName = t.getAttribute('download') || '';" +
            "        break;" +
            "      }" +
            "      t = t.parentNode;" +
            "    }" +
            "  }, true);" +
            "})();";
        webView.evaluateJavascript(js, null);
    }

    private String blobToBase64Script(String blobUrl, String mimeType) {
        return
            "(function(){" +
            "  var xhr = new XMLHttpRequest();" +
            "  xhr.open('GET', '" + blobUrl + "', true);" +
            "  xhr.responseType = 'blob';" +
            "  xhr.onload = function(){" +
            "    if (this.status === 200) {" +
            "      var r = new FileReader();" +
            "      r.onloadend = function(){" +
            "        AndroidBridge.saveBase64(r.result, window.__lastDownloadName || '');" +
            "      };" +
            "      r.readAsDataURL(this.response);" +
            "    }" +
            "  };" +
            "  xhr.send();" +
            "})();";
    }

    private void saveDataUrl(String dataUrl, String suggestedName) {
        try {
            int comma = dataUrl.indexOf(',');
            if (comma < 0) throw new IllegalArgumentException("data URL invalide");

            String header = dataUrl.substring(5, comma);       // après "data:"
            String payload = dataUrl.substring(comma + 1);
            String mime = header.split(";")[0];
            if (mime.isEmpty()) mime = "application/octet-stream";

            byte[] bytes = header.contains("base64")
                    ? Base64.decode(payload, Base64.DEFAULT)
                    : Uri.decode(payload).getBytes("UTF-8");

            String name = (suggestedName == null || suggestedName.trim().isEmpty())
                    ? defaultFileName(mime)
                    : suggestedName.trim();

            writeToDownloads(name, mime, bytes);
            toast("Enregistré dans Téléchargements : " + name);
        } catch (Exception e) {
            toast("Échec de l'enregistrement : " + e.getMessage());
        }
    }

    private void writeToDownloads(String name, String mime, byte[] bytes) throws Exception {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Downloads.DISPLAY_NAME, name);
            values.put(MediaStore.Downloads.MIME_TYPE, mime);
            values.put(MediaStore.Downloads.IS_PENDING, 1);

            Uri collection = MediaStore.Downloads.EXTERNAL_CONTENT_URI;
            Uri item = getContentResolver().insert(collection, values);
            if (item == null) throw new IllegalStateException("insertion impossible");

            try (OutputStream out = getContentResolver().openOutputStream(item)) {
                if (out == null) throw new IllegalStateException("flux indisponible");
                out.write(bytes);
            }
            values.clear();
            values.put(MediaStore.Downloads.IS_PENDING, 0);
            getContentResolver().update(item, values, null, null);
        } else {
            File dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            if (!dir.exists() && !dir.mkdirs()) throw new IllegalStateException("dossier introuvable");
            File file = new File(dir, name);
            try (FileOutputStream out = new FileOutputStream(file)) {
                out.write(bytes);
            }
        }
    }

    private String defaultFileName(String mime) {
        String ext = "bin";
        if (mime.contains("pdf")) ext = "pdf";
        else if (mime.contains("html")) ext = "html";
        else if (mime.contains("json")) ext = "json";
        else if (mime.contains("csv")) ext = "csv";
        else if (mime.contains("plain")) ext = "txt";
        else if (mime.contains("wordprocessingml")) ext = "docx";
        else if (mime.contains("msword")) ext = "doc";
        else if (mime.contains("spreadsheetml")) ext = "xlsx";
        else if (mime.contains("png")) ext = "png";
        else if (mime.contains("jpeg")) ext = "jpg";
        String stamp = new SimpleDateFormat("yyyyMMdd-HHmmss", Locale.US).format(new Date());
        return "document-" + stamp + "." + ext;
    }

    private void toast(String message) {
        runOnUiThread(() -> Toast.makeText(this, message, Toast.LENGTH_LONG).show());
    }

    /** Ponts appelés depuis JavaScript. */
    public class AndroidBridge {

        @JavascriptInterface
        public void printPage(final String title) {
            runOnUiThread(() -> {
                String jobName = (title == null || title.trim().isEmpty())
                        ? getString(R.string.app_name)
                        : title.trim();
                PrintManager printManager = (PrintManager) getSystemService(PRINT_SERVICE);
                if (printManager == null) {
                    toast("Impression indisponible sur cet appareil.");
                    return;
                }
                printManager.print(
                        jobName,
                        webView.createPrintDocumentAdapter(jobName),
                        new PrintAttributes.Builder().build());
            });
        }

        @JavascriptInterface
        public void saveBase64(String dataUrl, String suggestedName) {
            saveDataUrl(dataUrl, suggestedName);
        }
    }
}
