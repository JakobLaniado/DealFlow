package com.reactnativezoom.sdk;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;

public class Utils {
  public static boolean checkRNActivity(ReactApplicationContext reactContext, Promise promise) {
    if (reactContext == null || reactContext.getCurrentActivity() == null) {
      promise.reject("context_error", "Cannot get react native activity", (WritableMap) null);
      return true;
    }
    return false;
  }
}
