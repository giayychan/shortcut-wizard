# Bugs

* UI fixes (scroll, infinite scroll, mass data)
* app icon
* finish initial shortcut data - adhoc, test them?
<!-- * infinity scroll -->
* move them to db?
* sync add/remove shortcuts vector in vector store
* move langchain to web (security)

Side features:

* Shortcut store to let users put shortcut templates for sell and users to buy and download
* Add dictionary?

DEBUG IN PROD:
> lldb path/to/build.app
> run --remote-debugging-port=8315

https://stackoverflow.com/a/56634497/11899667
In terminal type lldb path/to/build.app
In the opened debugger type run --remote-debugging-port=8315. It should open a window of your app.
Open Chrome at http://localhost:8315/
Click on the name of the app. For example, Webpack App.
If you don't see anything in the opened tab, focus on the window of your app.

User data folder: /Users/yanyan/Library/Application Support/Electron
