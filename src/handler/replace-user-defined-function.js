// @flow
import type Account from "../account";

const json = require("../json");

module.exports = async (
  account: Account,
  req: http$IncomingMessage,
  res: http$ServerResponse,
  { dbId, collId, udfId }: { dbId: string, collId: string, udfId: string }
) => {
  const body = await json(req);
  if (!body.id) {
    res.statusCode = 400;
    return { Message: "missing id" };
  }

  const collection = account.database(dbId).collection(collId);
  const data = collection.userDefinedFunction(udfId).read();
  if (!data) {
    res.statusCode = 404;
    return {};
  }

  if (data.id !== body.id) {
    res.statusCode = 400;
    return { Message: "replacing id is not allowed" };
  }

  return collection.userDefinedFunctions.replace(body);
};