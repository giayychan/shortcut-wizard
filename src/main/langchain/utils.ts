// eslint-disable-next-line import/prefer-default-export
export function sanitizedData(prompt: string, softwareKey: string) {
  // todo: software key should be the human readable name, so we should change the data structure and add a software label to each json
  const sanitizedSoftwareKey = softwareKey.toLowerCase().trim();

  const sanitizedPrompt = prompt.trim();
  return { key: sanitizedSoftwareKey, prompt: sanitizedPrompt };
}
