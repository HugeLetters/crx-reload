# Setup

Run `npm run build` to produce .js scripts and css to dist folder

# Usage

To use during your own chrome extension development

```javascript
import { Server } from "socket.io";
// PORT is the same one you have selected in extension pop-up
const io = new Server(PORT);
// Every time you would like to reload extensions - do this
io.emit("crx-reload");
```
