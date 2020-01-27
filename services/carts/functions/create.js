import uuid from "uuid";
import * as dynamoDbLib from "../../../libs/dynamodb-lib";
import { success, failure } from "../../../libs/response-lib";

export async function main(event, context) {
  // {
  //   "IdCliente":0,
  //   "SenhaDeConfirmacao":"",
  //   "TokenFb":"",
  //   "IdEvento":508,
  //   "ItensVendas":
  //   [
  //     {
  //       "IdOrigem":3046,
  //       "Quantidade":1,
  //       "Observacoes":"",
  //       "Origem":"Ingresso"
  //     }
  //   ],"IdLink":992}
  const data = JSON.parse(event.body);
  console.log(data);
  const params = {
    TableName: "carts",
    Item: {
      cartId: uuid.v1(),
      //userId sent from bearer token payload (auth header)
      idCliente: event.requestContext.authorizer.principalId,
      content: data,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
