# RFC Studio Website

**Creative Video. AI-Powered. Built for Social.**

A multi-page static website for RFC Studio. It's plain HTML, CSS and JavaScript with no build step.

## Pages
| File | Page |
|---|---|
| `index.html` | Home: hero with a phone mockup, stats, intro, services overview, why RFC, numbers, selected work |
| `services.html` | Five services in detail + the process |
| `projects.html` | Client projects with playable Instagram, TikTok and YouTube videos |
| `about.html` | About + our approach |
| `faq.html` | Frequently asked questions |
| `contact.html` | Inquiry form |

`styles.css` holds the whole design: navy and electric blue, with Bricolage Grotesque, Instrument Serif and Caveat fonts. `script.js` handles animations, the video pop-up, the mobile menu and the form.

## Customize
- **Contact email**: change `CONTACT_EMAIL` at the top of `script.js`.
- **Colors**: edit the variables at the top of `styles.css` (`--navy`, `--blue`, `--ice`, …).
- **Projects**: each project card in `projects.html` / `index.html` has `data-embed` (the video player URL) and `data-link` (the original post).

## Publish
In GitHub, go to **Settings → Pages** and deploy from this branch's root folder. The project videos play on the live site.
