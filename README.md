# RFC Studio Website

**Creative Video. AI-Powered. Built for Social.**

A one-page static website for RFC Studio. It's plain HTML, CSS and JavaScript with no build step.

## Files
- `index.html`: all page content (Home, Services, Why Us, Numbers, Process, Projects, About, FAQ, Contact)
- `styles.css`: design (dark minimalist theme, lime accent `#d4ff3a`)
- `script.js`: animations, counters, accordion, mobile menu, contact form

## Preview
Open `index.html` in a browser.

## Customize
- **Contact email**: change `CONTACT_EMAIL` at the top of `script.js`. The form opens the visitor's email app with the inquiry already filled in.
- **Project videos**: put your clips in a `videos/` folder. Then, in `index.html`, replace a project's
  `<span class="play">` placeholder with
  `<video src="videos/your-clip.mp4" autoplay muted loop playsinline></video>`.
- **Accent color**: edit `--accent` in `styles.css`.

## Publish (free)
In GitHub, go to **Settings → Pages** and deploy from this branch's root folder. Netlify and Vercel also work: drag and drop the folder.
