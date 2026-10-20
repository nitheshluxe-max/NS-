import JSZip from 'jszip';
import { getPublicShareUrl } from './shareUrl';

export interface PlayStoreListingData {
  appName: string;
  appShortName: string;
  packageId: string;
  versionName: string;
  versionCode: number;
  shortDescription: string;
  fullDescription: string;
  category: string;
  developerEmail: string;
  privacyPolicyUrl: string;
  themeColor: string;
  backgroundColor: string;
  publicHostUrl: string;
}

export const DEFAULT_PLAYSTORE_CONFIG: PlayStoreListingData = {
  appName: 'NSProperties',
  appShortName: 'NSProperties',
  packageId: 'in.nsproperties.app',
  versionName: '1.0.0',
  versionCode: 1,
  shortDescription: 'Buy, rent, list verified homes, flats, villas and plots in India with free visits.',
  fullDescription: `Welcome to NS Properties — India's premier luxury real estate and verified property search portal.

Whether you are looking to buy your dream villa, rent a luxury apartment, invest in RERA-approved plots, or list your property directly to thousands of verified buyers, NS Properties delivers an unmatched real estate experience.

KEY FEATURES:
• 100% RERA Verified Listings across Bangalore, Mumbai, Delhi NCR, Hyderabad, Pune, and Chennai
• 100% FREE Site Visits for prospective buyers, real estate agents, and builders
• Direct Owner and Builder Contacts with zero hidden broker commissions
• Instant EMI Loan Calculator with amortization schedules and bank loan comparisons
• Interactive 2D/3D Architectural Floor Plans with room dimension unlocks
• Exclusive Festival Offers, stamp duty concessions, and builder token discounts
• Real-time price trend heatmaps, locality insights, and price/sq.ft analytics
• Certified Real Estate Agent and Builder partner plans with dedicated CRM

WHY CHOOSE NS PROPERTIES:
Every property on NS Properties undergoes strict title, legal, and RERA document verification. Enjoy high-resolution photo galleries, downloadable PDF brochures, and instant WhatsApp concierge support.

Download NS Properties today to find your luxury residence!`,
  category: 'House & Home / Real Estate',
  developerEmail: 'nitheshluxe@gmail.com',
  privacyPolicyUrl: 'https://nsproperties4.com/privacy',
  themeColor: '#0047E0',
  backgroundColor: '#0047E0',
  publicHostUrl: 'nsproperties4.com'
};

export async function generatePlayStoreProjectZip(
  customConfig?: Partial<PlayStoreListingData>,
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const hostUrl = customConfig?.publicHostUrl || getPublicShareUrl();
  const config: PlayStoreListingData = {
    ...DEFAULT_PLAYSTORE_CONFIG,
    ...customConfig,
    publicHostUrl: hostUrl
  };

  const parsedUrl = new URL(hostUrl.startsWith('http') ? hostUrl : `https://${hostUrl}`);
  const domainHost = parsedUrl.host;

  onProgress?.(10);

  // 1. twa-manifest.json (PWABuilder / Bubblewrap standard)
  const twaManifest = {
    packageId: config.packageId,
    host: domainHost,
    name: config.appName,
    launcherName: config.appShortName,
    themeColor: config.themeColor,
    navigationColor: config.themeColor,
    backgroundColor: config.backgroundColor,
    enableNotifications: true,
    startUrl: '/',
    appVersionName: config.versionName,
    appVersionCode: config.versionCode,
    shortcuts: [
      {
        name: 'Offers & Deals',
        short_name: 'Offers',
        url: '/#offers-deals-section',
        icon: 'icon_offers'
      },
      {
        name: 'EMI Calculator',
        short_name: 'EMI',
        url: '/?tool=emi',
        icon: 'icon_emi'
      }
    ],
    generatorApp: 'NS-Properties-PlayStore-Generator',
    webManifestUrl: `${hostUrl}/manifest.json`,
    fallbackType: 'customtabs',
    features: {
      locationDelegation: {
        enabled: true
      },
      playBilling: {
        enabled: false
      }
    },
    alphaDependencies: {
      enabled: false
    }
  };

  zip.file('twa-manifest.json', JSON.stringify(twaManifest, null, 2));

  // 2. assetlinks.json
  const assetlinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: config.packageId,
        sha256_cert_fingerprints: [
          '14:6D:E9:DE:4E:9F:8E:B2:D0:D4:56:56:47:82:17:80:FF:03:7E:8C:F9:64:CF:57:3F:8E:B6:F4:6F:E1:92:02',
          'E2:73:96:A8:FB:5E:2B:6E:5B:DC:65:21:49:15:BE:E5:69:B6:FE:57:4E:57:D8:1A:F7:BA:3C:99:C9:92:DF:99'
        ]
      }
    }
  ];

  zip.file('.well-known/assetlinks.json', JSON.stringify(assetlinks, null, 2));

  // 3. Root build.gradle
  const rootBuildGradle = `// Top-level build file for NS Properties Android TWA App
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`;
  zip.file('build.gradle', rootBuildGradle);

  // 4. settings.gradle
  zip.file('settings.gradle', `include ':app'\nrootProject.name = "NSPropertiesApp"`);

  // 5. gradle.properties
  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\nandroid.enableJetifier=true`
  );

  onProgress?.(30);

  // 6. app/build.gradle
  const appBuildGradle = `apply plugin: 'com.android.application'

android {
    namespace '${config.packageId}'
    compileSdk 34

    defaultConfig {
        applicationId "${config.packageId}"
        minSdk 21
        targetSdk 34
        versionCode ${config.versionCode}
        versionName "${config.versionName}"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"

        def hostName = "${domainHost}"
        def defaultUrl = "https://" + hostName + "/"
        resValue "string", "hostName", hostName
        resValue "string", "defaultUrl", defaultUrl
        resValue "string", "appName", "${config.appName}"
        resValue "string", "launcherName", "${config.appShortName}"
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    // Official Google Android Browser Helper for Trusted Web Activity (TWA)
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
    implementation 'androidx.browser:browser:1.8.0'
}
`;
  zip.file('app/build.gradle', appBuildGradle);

  // 7. app/src/main/AndroidManifest.xml
  const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.packageId}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/appName"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.LauncherActivity">

        <meta-data
            android:name="asset_statements"
            android:resource="@string/asset_statements" />

        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:label="@string/launcherName"
            android:theme="@style/Theme.LauncherActivity"
            android:exported="true">

            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="@string/defaultUrl" />

            <meta-data
                android:name="android.support.customtabs.trusted.STATUS_BAR_COLOR"
                android:resource="@color/colorPrimary" />

            <meta-data
                android:name="android.support.customtabs.trusted.NAVIGATION_BAR_COLOR"
                android:resource="@color/navigationColor" />

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Verification Intent Filter for Fullscreen TWA without URL bar -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="https"
                    android:host="@string/hostName" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`;
  zip.file('app/src/main/AndroidManifest.xml', androidManifest);

  // 8. XML Resource Files
  zip.file(
    'app/src/main/res/values/colors.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">${config.themeColor}</color>
    <color name="colorPrimaryDark">#000000</color>
    <color name="colorAccent">#C4A47C</color>
    <color name="navigationColor">${config.themeColor}</color>
    <color name="backgroundColor">${config.backgroundColor}</color>
    <color name="ic_launcher_background">#0047E0</color>
</resources>
`
  );

  // Android 8.0+ Adaptive Icon Definitions (Zero white border, edge-to-edge navy)
  zip.file(
    'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher"/>
</adaptive-icon>
`
  );

  zip.file(
    'app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher"/>
</adaptive-icon>
`
  );

  zip.file(
    'app/src/main/res/values/strings.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="appName">${config.appName}</string>
    <string name="launcherName">${config.appShortName}</string>
    <string name="hostName">${domainHost}</string>
    <string name="defaultUrl">https://${domainHost}/</string>
    <string name="asset_statements">[{\\"relation\\": [\\"delegate_permission/common.handle_all_urls\\"], \\"target\\": {\\"namespace\\": \\"android_app\\", \\"package_name\\": \\"${config.packageId}\\", \\"sha256_cert_fingerprints\\": [\\"14:6D:E9:DE:4E:9F:8E:B2:D0:D4:56:56:47:82:17:80:FF:03:7E:8C:F9:64:CF:57:3F:8E:B6:F4:6F:E1:92:02\\"]}}]</string>
</resources>
`
  );

  zip.file(
    'app/src/main/res/values/styles.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.LauncherActivity" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="android:statusBarColor">@color/colorPrimary</item>
        <item name="android:navigationBarColor">@color/navigationColor</item>
        <item name="android:windowBackground">@color/backgroundColor</item>
    </style>
</resources>
`
  );

  onProgress?.(60);

  // 9. Play Store Listing Metadata Text File (Copy & Paste Ready)
  const storeMetadataContent = `================================================================================
GOOGLE PLAY STORE LISTING DETAILS & METADATA
Application: NS Properties
Generated for Package: ${config.packageId}
Live Host Domain: ${domainHost}
================================================================================

1. APP TITLE (Max 30 characters):
${config.appName.slice(0, 30)}

2. SHORT DESCRIPTION (Max 80 characters):
${config.shortDescription.slice(0, 80)}

3. FULL DESCRIPTION (Up to 4000 characters):
${config.fullDescription}

4. APPLICATION CATEGORY:
Category: House & Home
Tags: Real estate, Property, House hunting, Apartments, Rent, Buy home

5. CONTACT DETAILS FOR STORE LISTING:
Developer Email: ${config.developerEmail}
Phone Number: +91 98450 12345
Website: ${hostUrl}
Privacy Policy URL: ${config.privacyPolicyUrl}

6. MANDATORY GRAPHIC ASSETS REQUIRED BY GOOGLE PLAY:
• App Icon: 512 x 512 px PNG (32-bit color, up to 1024 KB) - provided in /public/pwa-512x512.png
• Feature Graphic: 1024 x 500 px PNG/JPEG - provided in /public/play-store-feature-graphic.svg
• Phone Screenshots: At least 2 screenshots (16:9 or 18:9 aspect ratio, minimum 1080px width)

7. DIGITAL ASSET LINKS VERIFICATION:
Make sure your live web domain serves the following file:
URL: https://${domainHost}/.well-known/assetlinks.json
Content-Type: application/json
`;
  zip.file('GOOGLE_PLAY_STORE_LISTING_METADATA.txt', storeMetadataContent);

  // 10. Step-by-step Walkthrough Guide
  const publishGuideMd = `# Google Play Store Publishing Guide for NS Properties

This package contains the complete Android Trusted Web Activity (TWA) project for **NS Properties**, conforming to Google's official Android and Google Play store standards.

---

## Method 1: Instant 1-Click Android App Bundle (.aab) via PWABuilder (Recommended)

1. Open **[PWABuilder.com](https://www.pwabuilder.com?url=${encodeURIComponent(hostUrl)})** in your browser.
2. Enter your live URL: \`${hostUrl}\`.
3. Click **"Package for Stores"** and select **"Android"**.
4. Set Package ID to \`${config.packageId}\`.
5. Under Signing Key, choose **"Create New Key"** or download PWABuilder's generated key.
6. Click **"Download Package"** to receive your signed **.aab (Android App Bundle)** file.

---

## Method 2: Build Locally using Android Studio or Gradle

1. Open this unzipped folder in **Android Studio**.
2. Wait for Gradle sync to complete (it downloads \`androidbrowserhelper:2.5.0\`).
3. Click **Build > Generate Signed Bundle / APK**.
4. Select **Android App Bundle (.aab)**.
5. Create or select your release keystore (\`.jks\`).
6. Build the Release bundle. Your \`.aab\` will be created in \`app/release/app-release.aab\`.

---

## Method 3: Uploading to Google Play Console

1. Log in to [Google Play Console](https://play.google.com/console).
2. Click **Create App**:
   - App Name: \`${config.appName.slice(0, 30)}\`
   - Default Language: English (India / US)
   - App or Game: App
   - Free or Paid: Free
3. Fill in **Store Listing**:
   - Short Description: copy from \`GOOGLE_PLAY_STORE_LISTING_METADATA.txt\`
   - Full Description: copy from \`GOOGLE_PLAY_STORE_LISTING_METADATA.txt\`
   - Upload 512x512 App Icon and 1024x500 Feature Graphic
   - Upload at least 2 screenshots of the app
4. Complete **App Content declarations**:
   - Privacy Policy URL: \`${config.privacyPolicyUrl}\`
   - Ads: No ads (or as appropriate)
   - Target Age: 18+ (Real Estate & Property transactions)
   - Content Rating: Complete the questionnaire (rated Everyone / 3+)
5. In **Production > Releases**:
   - Click **Create new release**
   - Upload the \`.aab\` bundle
   - Review release details and click **Start Rollout to Production**!

Google reviews your submission typically within 24 to 48 hours, after which NS Properties will be live worldwide on the Google Play Store!
`;
  zip.file('HOW_TO_PUBLISH_TO_GOOGLE_PLAY.md', publishGuideMd);

  onProgress?.(80);

  // Fetch public graphic assets and include them into the zip
  try {
    const iconRes = await fetch('/pwa-512x512.png');
    if (iconRes.ok) {
      const iconBlob = await iconRes.blob();
      zip.file('playstore-assets/app-icon-512x512.png', iconBlob);

      // Populate all Android mipmap densities for adaptive icons
      zip.file('app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', iconBlob);
      zip.file('app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png', iconBlob);
      zip.file('app/src/main/res/mipmap-xxhdpi/ic_launcher.png', iconBlob);
      zip.file('app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png', iconBlob);
      zip.file('app/src/main/res/mipmap-xhdpi/ic_launcher.png', iconBlob);
      zip.file('app/src/main/res/mipmap-xhdpi/ic_launcher_round.png', iconBlob);
      zip.file('app/src/main/res/mipmap-hdpi/ic_launcher.png', iconBlob);
      zip.file('app/src/main/res/mipmap-hdpi/ic_launcher_round.png', iconBlob);
      zip.file('app/src/main/res/mipmap-mdpi/ic_launcher.png', iconBlob);
      zip.file('app/src/main/res/mipmap-mdpi/ic_launcher_round.png', iconBlob);
    }
  } catch (e) {
    console.warn('Icon asset fetch skipped in zip:', e);
  }

  try {
    const featureSvgRes = await fetch('/play-store-feature-graphic.svg');
    if (featureSvgRes.ok) {
      const featureSvgText = await featureSvgRes.text();
      zip.file('playstore-assets/feature-graphic-1024x500.svg', featureSvgText);
    }
  } catch (e) {
    console.warn('Feature graphic fetch skipped in zip:', e);
  }

  onProgress?.(95);

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `NS_Properties_Google_Play_TWA_Project_${config.packageId}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);

  onProgress?.(100);
}

export function downloadListingMetadataTextFile(config: PlayStoreListingData = DEFAULT_PLAYSTORE_CONFIG): void {
  const hostUrl = config.publicHostUrl || getPublicShareUrl();
  const domainHost = new URL(hostUrl.startsWith('http') ? hostUrl : `https://${hostUrl}`).host;

  const content = `================================================================================
GOOGLE PLAY STORE LISTING DETAILS & METADATA
Application: NS Properties
Generated for Package: ${config.packageId}
Live Host Domain: ${domainHost}
================================================================================

1. APP TITLE (Max 30 characters):
${config.appName.slice(0, 30)}

2. SHORT DESCRIPTION (Max 80 characters):
${config.shortDescription.slice(0, 80)}

3. FULL DESCRIPTION (Up to 4000 characters):
${config.fullDescription}

4. APPLICATION CATEGORY:
Category: House & Home
Tags: Real estate, Property, House hunting, Apartments, Rent, Buy home, Bangalore, Mumbai

5. CONTACT DETAILS FOR STORE LISTING:
Developer Email: ${config.developerEmail}
Phone Number: +91 98450 12345
Website: ${hostUrl}
Privacy Policy URL: ${config.privacyPolicyUrl}

6. MANDATORY GRAPHIC ASSETS REQUIRED BY GOOGLE PLAY:
• App Icon: 512 x 512 px PNG (32-bit color, up to 1024 KB) - located at /pwa-512x512.png
• Feature Graphic: 1024 x 500 px PNG/JPEG - located at /play-store-feature-graphic.svg
• Phone Screenshots: At least 2 screenshots (16:9 or 18:9 aspect ratio, minimum 1080px width)

7. DIGITAL ASSET LINKS VERIFICATION:
Make sure your live web domain serves the following file:
URL: https://${domainHost}/.well-known/assetlinks.json
Content-Type: application/json
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GOOGLE_PLAY_STORE_METADATA_NS_PROPERTIES.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
