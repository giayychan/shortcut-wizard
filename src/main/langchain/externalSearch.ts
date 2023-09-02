import { logError } from 'main/utils';
import { chainTwoPrompt, system } from './constants';

async function searchExternalShortcut(searchTerm: string, softwareKey: string) {
  try {
    const input = await chainTwoPrompt.format({
      action: searchTerm,
      software: softwareKey,
      system,
    });

    // console.log(input);
    // const response = await model.call(input);
    // const parsedResponse = await parser.parse(response);

    // console.log(parsedResponse);
  } catch (error: any) {
    // logError(error.message);
    logError(error.message);
    throw error;
  }
}
