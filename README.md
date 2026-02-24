![DVD-CLI Banner](https://togp.douxx.tech/?owner=douxxtech&repo=dvd-cli&avatar=false&theme=bash-dark-all&cache=false)

# DVD-CLI: The Ultimate ASCII DVD Bouncer

Welcome to **DVD-CLI**, the easiest way to bring back nostalgic memories of the classic DVD screensaver right in your terminal! This tool is perfect for adding a touch of retro fun to your command-line experience.

## 🚀 Features

- **Animated DVD Logo**: Watch the DVD logo bounce around your terminal.
- **Customizable Speed**: Adjust the animation speed to your liking.
- **Colorful Display**: Enjoy a vibrant display with random colors.
- **Banner Information**: Keep track of runtime, speed, FPS, and more.
- **Command Execution**: Trigger commands when the logo hits the perfect corner.
- **Monochrome Mode**: Switch to a classic black-and-white display.
- **Fireworks Mode**: Add a burst of random colors every frame.
- **Explosion Effect**: See an explosion effect on collisions.
- **Debug Mode**: Get detailed debug information for developers.

## 📦 Installation

You can install **DVD-CLI** globally using npm:

```bash
npm install -g dvd-cli
```

## 🎬 Usage

Once installed, you can start the DVD bouncer with a simple command:

```bash
dvd-cli
```

### Options

**DVD-CLI** comes with a variety of options to customize your experience:

- `-c, --command <command>`: Execute a command when the logo hits the perfect corner.
- `-s, --speed <ms>`: Set a custom speed for the animation (in milliseconds).
- `-b, --no-banner`: Disable the banner.
- `-u, --no-user`: Hide the current user in the banner.
- `-m, --monochrome`: Enable monochrome mode (no colors).
- `-t, --title <title>`: Set a custom title for the banner.
- `-r, --rows <rows>`: Set a custom number of rows for the terminal.
- `-w, --cols <cols>`: Set a custom number of columns for the terminal.
- `-i, --invert`: Invert the colors of the logo.
- `-f, --fireworks`: Enable fireworks mode (random colors every frame).
- `-l, --slow`: Enable slow mode (halve the animation speed).
- `-a, --fast`: Enable fast mode (double the animation speed).
- `-e, --explosion`: Enable explosion mode (explosion effect on collision).
- `-d, --debug`: Enable debug mode (show debug information).
- `-o, --output <file>`: Save statistics to a file.
- `-h, --help`: Show the help message.

### Example

```bash
dvd-cli --command "echo Hello" --speed 50 --no-banner --no-user --monochrome --title "My Title" --rows 30 --cols 100 --invert --fireworks --slow --fast --explosion --debug --output stats.txt
```

## 📜 License

**DVD-CLI** is licensed under the GPL-3.0 License. See the [LICENSE](LICENSE) file for more details.

## 🔗 Links

- [GitHub Repository](https://github.com/douxxtech/dvd-cli)
- [npm Package](https://npmjs.com/package/dvd-cli)

## 📞 Contact

For any questions or feedback, feel free to reach out to the maintainer:


- GitHub: [@douxxtech](https://github.com/douxxtech)
