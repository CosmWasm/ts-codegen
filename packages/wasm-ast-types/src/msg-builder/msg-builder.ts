import * as t from "@babel/types";
import { camel } from "case";
import {
  abstractClassDeclaration,
  arrowFunctionExpression,
  bindMethod,
  classDeclaration,
  getMessageProperties,
} from "../utils";
import { ExecuteMsg, QueryMsg } from "../types";
import { createTypedObjectParams } from "../utils/types";
import { RenderContext } from "../context";
import { getWasmMethodArgs } from "../client/client";

export const createMsgBuilderClass = (
  context: RenderContext,
  className: string,
  msg: ExecuteMsg | QueryMsg
) => {
  const staticMethods = getMessageProperties(msg).map((schema) => {
    return createStaticExecMethodMsgBuilder(context, schema, msg.title);
  });

  // const blockStmt = bindings;

  return t.exportNamedDeclaration(
    abstractClassDeclaration(className, staticMethods, [], null)
  );
};

const createStaticExecMethodMsgBuilder = (
  context: RenderContext,
  jsonschema: any,
  msgTitle: string
) => {
  const underscoreName = Object.keys(jsonschema.properties)[0];
  const methodName = camel(underscoreName);
  const obj = createTypedObjectParams(
    context,
    jsonschema.properties[underscoreName]
  );
  const args = getWasmMethodArgs(
    context,
    jsonschema.properties[underscoreName]
  );

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      obj
        ? [
            // props
            obj,
          ]
        : [],
      t.blockStatement([
        t.returnStatement(
          t.objectExpression([
            t.objectProperty(
              t.identifier(underscoreName),
              t.tsAsExpression(t.objectExpression(args), t.tsTypeReference(t.identifier('const')))
            ),
          ])
        ),
      ]),
      // return type
      t.tsTypeAnnotation(t.tsTypeReference(t.identifier(msgTitle))),
      false
    ),
    null,
    null,
    false,
    // static
    true
  );
};
