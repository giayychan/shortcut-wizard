import { v4, validate } from 'uuid';
import { readJson, readdir, writeJson } from 'fs-extra';
import { getAssetPath } from './path';
import { SoftwareShortcut } from '../../../@types';
import { logError } from '.';

const acceptedKeys = [
  { key: 'escape', symbol: ['esc'] },
  { key: 'f1', symbol: [] },
  { key: 'f2', symbol: [] },
  { key: 'f3', symbol: [] },
  { key: 'f4', symbol: [] },
  { key: 'f5', symbol: [] },
  { key: 'f6', symbol: [] },
  { key: 'f7', symbol: [] },
  { key: 'f8', symbol: [] },
  { key: 'f9', symbol: [] },
  { key: 'f10', symbol: [] },
  { key: 'f11', symbol: [] },
  { key: 'f12', symbol: [] },
  { key: 'backquote', symbol: ['`'] },
  { key: '1', symbol: [] },
  { key: '2', symbol: [] },
  { key: '3', symbol: [] },
  { key: '4', symbol: [] },
  { key: '5', symbol: [] },
  { key: '6', symbol: [] },
  { key: '7', symbol: [] },
  { key: '8', symbol: [] },
  { key: '9', symbol: [] },
  { key: '0', symbol: [] },
  { key: 'minus', symbol: ['-'] },
  { key: 'equal', symbol: ['='] },
  { key: 'backspace', symbol: ['delete', 'del'] },
  { key: 'tab', symbol: [] },
  { key: 'bracketleft', symbol: ['[', 'left square bracket'] },
  { key: 'bracketright', symbol: [']', 'right square bracket'] },
  { key: 'backslash', symbol: ['\\'] },
  { key: 'capslock', symbol: [] },
  { key: 'semicolon', symbol: [';'] },
  { key: 'quote', symbol: ["'"] },
  { key: 'enter', symbol: [] },
  { key: 'shift', symbol: [] },
  { key: 'comma', symbol: [','] },
  { key: 'period', symbol: ['.'] },
  { key: 'slash', symbol: ['/'] },
  { key: 'alt', symbol: ['option', 'opt'] },
  { key: 'ctrl', symbol: [] },
  { key: 'meta', symbol: ['cmd', 'command', 'win'] },
  { key: 'space', symbol: [' '] },
  { key: 'up', symbol: ['up arrow'] },
  { key: 'down', symbol: ['down arrow'] },
  { key: 'left', symbol: ['left arrow'] },
  { key: 'right', symbol: ['right arrow'] },
  { key: 'a', symbol: [] },
  { key: 'b', symbol: [] },
  { key: 'c', symbol: [] },
  { key: 'd', symbol: [] },
  { key: 'e', symbol: [] },
  { key: 'f', symbol: [] },
  { key: 'g', symbol: [] },
  { key: 'h', symbol: [] },
  { key: 'i', symbol: [] },
  { key: 'j', symbol: [] },
  { key: 'k', symbol: [] },
  { key: 'l', symbol: [] },
  { key: 'm', symbol: [] },
  { key: 'n', symbol: [] },
  { key: 'o', symbol: [] },
  { key: 'p', symbol: [] },
  { key: 'q', symbol: [] },
  { key: 'r', symbol: [] },
  { key: 's', symbol: [] },
  { key: 't', symbol: [] },
  { key: 'u', symbol: [] },
  { key: 'v', symbol: [] },
  { key: 'w', symbol: [] },
  { key: 'x', symbol: [] },
  { key: 'y', symbol: [] },
  { key: 'z', symbol: [] },
];

const shiftKeys = [
  { key: '~', hotkey: ['shift', 'backquote'] },
  { key: '!', hotkey: ['shift', '1'] },
  { key: '@', hotkey: ['shift', '2'] },
  { key: '#', hotkey: ['shift', '3'] },
  { key: '$', hotkey: ['shift', '4'] },
  { key: '%', hotkey: ['shift', '5'] },
  { key: '^', hotkey: ['shift', '6'] },
  { key: '&', hotkey: ['shift', '7'] },
  { key: '*', hotkey: ['shift', '8'] },
  { key: '(', hotkey: ['shift', '9'] },
  { key: ')', hotkey: ['shift', '0'] },
  { key: '_', hotkey: ['shift', 'minus'] },
  { key: '+', hotkey: ['shift', 'equal'] },
  { key: '{', hotkey: ['shift', 'bracketleft'] },
  { key: '}', hotkey: ['shift', 'bracketright'] },
  { key: '|', hotkey: ['shift', 'backslash'] },
  { key: ':', hotkey: ['shift', 'semicolon'] },
  { key: '"', hotkey: ['shift', 'quote'] },
  { key: '<', hotkey: ['shift', 'comma'] },
  { key: '>', hotkey: ['shift', 'period'] },
  { key: '?', hotkey: ['shift', 'slash'] },
];

// eslint-disable-next-line import/prefer-default-export
async function sanitizeShortcutTemplates() {
  try {
    const destination = getAssetPath('data', 'shortcuts');

    // get all templates
    const platforms = await readdir(destination, {
      recursive: true,
    });

    if (!platforms.length) return;

    await Promise.all(
      platforms.map(async (platform) => {
        const fileData = await readdir(`${destination}/${platform}`, {
          recursive: true,
        });

        await Promise.all(
          fileData.map(async (file) => {
            const data: SoftwareShortcut = await readJson(
              `${destination}/${platform}/${file}`
            );

            if (!data.software.id || !validate(data.software.id)) {
              data.software.id = v4();
            }

            for (let index = 0; index < data.shortcuts.length; index += 1) {
              const { hotkeys } = data.shortcuts[index];
              if (
                !data.shortcuts[index].id ||
                !validate(data.shortcuts[index].id)
              ) {
                data.shortcuts[index].id = v4();
              }

              for (let j = 0; j < hotkeys.length; j += 1) {
                const hotkey = data.shortcuts[index].hotkeys[j];

                for (let k = 0; k < hotkey.length; k += 1) {
                  data.shortcuts[index].hotkeys[j][k] =
                    data.shortcuts[index].hotkeys[j][k].toLowerCase();

                  // sanitize hotkey
                  if (
                    !acceptedKeys.find(
                      (key) => key.key === data.shortcuts[index].hotkeys[j][k]
                    )
                  ) {
                    const replacement = acceptedKeys.find((key) =>
                      key.symbol.includes(data.shortcuts[index].hotkeys[j][k])
                    );

                    if (!replacement) {
                      const isShiftKey = shiftKeys.find(
                        (shiftKey) =>
                          shiftKey.key === data.shortcuts[index].hotkeys[j][k]
                      );

                      if (isShiftKey) {
                        logError(
                          `Found replacement shift key for ${data.shortcuts[index].hotkeys[j][k]}`,
                          data.shortcuts[index].id,
                          data.shortcuts[index].hotkeys
                        );
                      } else {
                        logError(
                          `Cant find replacement key for ${data.shortcuts[index].hotkeys[j][k]}`,
                          data.shortcuts[index].id
                        );
                      }
                    } else {
                      data.shortcuts[index].hotkeys[j][k] = replacement.key;
                    }
                  }
                }
              }
            }

            await writeJson(`${destination}/${platform}/${file}`, data);
          })
        );
      })
    );
  } catch (error: any) {
    logError(error.message);
  }
}
