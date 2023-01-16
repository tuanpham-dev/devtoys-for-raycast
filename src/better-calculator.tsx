import { Action, ActionPanel, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { create, all } from "mathjs";

const math = create(all);

const repairExpression = (expression: string) => {
  let result = expression;
  let balanced = 0;

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === "(") {
      balanced += 1;
    } else if (expression[i] === ")") {
      balanced -= 1;

      if (balanced < 0) {
        balanced += 1;
        result = "(" + result;
      }
    }
  }

  return `${result}${")".repeat(balanced)}`;
};

export default function BetterCalculatorCommand() {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    if (expression === "") {
      setResult("");
      return;
    }

    try {
      const actualExpression = repairExpression(expression);
      const result = math.evaluate(actualExpression);

      if (typeof result === "number") {
        setResult(result.toString());
      }
    } catch (_) {
      return;
    }
  }, [expression]);

  return (
    <List searchText={expression} onSearchTextChange={setExpression}>
      <List.Item
        title={result}
        actions={
          <ActionPanel>
            <Action.CopyToClipboard content={result} title={`Copy ${result} to Clipboard`} />
          </ActionPanel>
        }
      />
    </List>
  );
}
