  // request permission on page load
document.addEventListener('DOMContentLoaded', function() {
 if (!Notification) {
  alert('Desktop notifications not available in your browser. Try Chromium.');
  return;
 }

 if (Notification.permission !== 'granted')
  Notification.requestPermission();
});


function notify(tx,title) {
 if (Notification.permission !== 'granted')
  Notification.requestPermission();
 else {
  var notification = new Notification(title, {
   icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
   body: tx,
  });
  notification.onclick = function() {
   window.open('/');
  };
 }
}

