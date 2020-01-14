self.addEventListener('install', event => {
  console.log("INFO: service worker install");
});

self.addEventListener('activate', event => {
  console.log("INFO: service worker activate");
});

self.addEventListener('message', function(event){
  console.log("INFO: service worker message: " + event.data);
  if (event.data.sender === "open-window-button") {
    open_window(event);
  } else if (event.data.sender === "present-slide-button") {
    present_slide(event);
  }
});

self.addEventListener('notificationclick', async function(event) {
  console.log("INFO: service worker notificationclick");
  clients.openWindow('./slide.html');
  event.notification.close();

  // TODO: Expose screen information for service workers?
  // TODO: Support Service Worker's clients.openWindow options onces that lands.
  // const screens = await self.getScreens();
  // var options = { x:      screens[0].left,
  //                 y:      screens[0].top,
  //                 width:  screens[0].width,
  //                 height: screens[0].height,
  //                 type:  "window" }
  // clients.openWindow('./slide.html', options);
});

function open_window(event) {
  var url = './slide.html'
  var options = { x:50, y:100, width:400, height:200, type:"window"}
  if (event && event.data && event.data.url.length != 0)
    url = event.data.url;
  if (event && event.data && event.data.options)
    options = event.data.options;
  console.log("INFO: Calling openWindow(" + url + "," + JSON.stringify(options) + ")");
  const promise = clients.openWindow(url, options);
  // TODO: event.waitUntil(promise); ? 
}

async function present_slide(event) {
  // TODO: Expose screen information for service workers?
  // const screens = await self.getScreens();
  var slide_options = { x:0, y:0, width:800, height:600, type:"window"};
  var notes_options = { x:0, y:600, width:800, height:200, type:"window"};
  if (screens && screens.length > 1) {
    slide_options = { x:screens[1].left, y:screens[1].top, width:screens[1].width, height:screens[1].height, type:"window"};
    notes_options = { x:screens[0].left, y:screens[0].top, width:screens[0].width, height:screens[0].height, type:"window"};
  }
  // console.log("INFO: slide: " + slide_options.x + "," + slide_options.y + " " + slide_options.width + "x" + slide_options.height);
  // console.log("INFO: notes: " + notes_options.x + "," + notes_options.y + " " + notes_options.width + "x" + notes_options.height);
  const slide_promise = clients.openWindow('./slide.html', slide_options);
  // event.waitUntil(slide_promise);
  // TODO: opening another window clobbers the first... 
  // const notes_promise = clients.openWindow('./slide.html', notes_options);
  // event.waitUntil(notes_promise);
}

// function cautious_open_window(event) {
//   try {
//     console.log("INFO: calling openWindow");
//     const promise = clients.openWindow('./slide.html', { x:100, y:100, width:300, height:300, type:"window"});
//     if (promise !== undefined) {
//       promise.then(_ => {
//         console.log("INFO: openWindow ok");
//       }).catch(error => {
//         console.log("INFO: openWindow fail: " + error);
//       });
//     } else {
//       console.log("INFO: openWindow fail (undefined?)");
//     }
//     console.log("INFO: waiting for openWindow promise");
//     // event.waitUntil(promise);
//   } catch (error) {
//     console.log("INFO: caught error:" + error);
//   }
// }