package com.queek;

import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.jetbrains.annotations.Nullable;

import in.digio.sdk.kyc.DigioEnvironment;
import in.digio.sdk.kyc.DigioKycConfig;
import in.digio.sdk.kyc.DigioKycResponseListener;
import in.digio.sdk.kyc.DigioSession;

public class DigioModule extends ReactContextBaseJavaModule implements DigioKycResponseListener {
    DigioModule(ReactApplicationContext context){
        super(context);
    }

    private DeviceEventManagerModule.RCTDeviceEventEmitter mEmitter = null;

    @Override
    public String getName() {
        return "DigioModule";
    }

    @ReactMethod
    public void initiateDigioKycProcess(String transactionId, String identifier, String tokenId) {
        try {
            DigioKycConfig config = new DigioKycConfig();
            config.setEnvironment(DigioEnvironment.SANDBOX);

            DigioSession digioSession = new DigioSession();
            digioSession.init((AppCompatActivity)getCurrentActivity(), config);
            digioSession.startSession(transactionId, identifier,tokenId,this);// this refers //DigioKycResponseListener
        } catch(Exception e) {

        }
    }

    @Override
    public void onDigioKycSuccess(@Nullable String s, @Nullable String s1) {
        sendEvent("Success", s+' '+s1);
    }

    @Override
    public void onDigioKycFailure(@Nullable String s, @Nullable String s1) {
        sendEvent("failure", s+' '+s1);
    }

    public void sendEvent(String eventName, String message){
        WritableMap params = Arguments.createMap();
        params.putString("message", message);
        if(mEmitter == null){
            mEmitter = getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
        if(mEmitter != null){
            mEmitter.emit(eventName, params);
        }
    }

}