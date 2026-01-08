package com.mobilern

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class NotificationService : Service() {
  private val CHANNEL_ID = "rn_zoom_SDK_notification_channel_id"
  private val NOTIFICATION_ID = 9

  override fun onCreate() {
    super.onCreate()
    val builder = NotificationCompat.Builder(applicationContext, CHANNEL_ID)
      .setAutoCancel(false)
      .setOngoing(true)
      .setContentText("RNZoomSDK Screen Share")

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      var channel = manager.getNotificationChannel(CHANNEL_ID)

      if (channel == null) {
        channel = NotificationChannel(CHANNEL_ID, "RNZoomNotification", NotificationManager.IMPORTANCE_DEFAULT)
        if (channel.canShowBadge()) {
          channel.setShowBadge(false)
        }
      }
      if (manager != null) {
        manager.createNotificationChannel(channel)
      }
      startForeground(NOTIFICATION_ID, builder.build())
    }
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    return super.onStartCommand(intent, flags, startId)
  }

  override fun onDestroy() {
    super.onDestroy()
  }

  override fun onBind(intent: Intent?): IBinder? {
    return null
  }

  override fun onTaskRemoved(rootIntent: Intent?) {
    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    manager.cancel(NOTIFICATION_ID)
    stopSelf()
  }
}
