import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajvInstance = new Ajv({allErrors: true});
  addFormats(ajvInstance);

export default ajvInstance;
// import Ajv from "ajv/dist/jtd";

// const ajv = new Ajv();

// export default ajv;
