const promiseError = async (promise) => {
  let err;

  try {
    await promise;
  } catch (e) {
    err = e;
  }

  return err;
};

export default promiseError;
