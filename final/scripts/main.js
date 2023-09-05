"use strict";

const notificationButton = document.getElementById("enableNotifications");
const statusPlaceholderHtml = document.getElementById("statusPlaceholder");

let swRegistration = null;

initializeApp();

function initializeApp() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    statusPlaceholderHtml.append('Service Worker and Push is supported')
    console.log("Service Worker and Push is supported");

    //Register the service worker
    navigator.serviceWorker
      .register("../../sw.js")
      .then(swReg => {
        
        statusPlaceholderHtml.append('Service Worker is registered')
        console.log("Service Worker is registered", swReg);

        swRegistration = swReg;
        initializeUi();
      })
      .catch(error => {
        statusPlaceholderHtml.append('Service Worker Error:'+ error.message)
        console.error("Service Worker Error", error);
      });
  } else {
    console.warn("Push messaging is not supported");
    statusPlaceholderHtml.append('Push messaging is not supported')
    notificationButton.textContent = "Push Not Supported";
  }
}

function initializeUi() {
  notificationButton.addEventListener("click", () => {
    displayNotification();
  });
}

function displayNotification() {
  if (window.Notification && Notification.permission === "granted") {
    notification();
  }
  // If the user hasn't told if he wants to be notified or not
  // Note: because of Chrome, we are not sure the permission property
  // is set, therefore it's unsafe to check for the "default" value.
  else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(status => {
      if (status === "granted") {
        notification();
      } else {
        statusPlaceholderHtml.append('You denied or dismissed permissions to notifications')
        alert("You denied or dismissed permissions to notifications.");
      }
    });
  } else {
    // If the user refuses to get notified
      statusPlaceholderHtml.append('You denied permissions to notifications. Please go to your browser or phone setting to allow notifications.')
    alert(
      "You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
    );
  }
}

function notification() {
  const options = {
    body: "Testing Our Notification",
    icon: "./bell.png"
  };
  swRegistration.showNotification("PWA Notification!", options);
}
