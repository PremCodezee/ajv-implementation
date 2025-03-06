// Importing the messages from a JSON file
import messagesJSON from './en.json';

// Function to get a message by key.
const getMessage = (key: keyof typeof messagesJSON): string => {
  return messagesJSON[key];
};

// Exporting the getMessage function as the default export
export default getMessage;
