import { Reimbursement } from "@prisma/client";
import { CreateReimbursementInput } from "../modules/reimbursements/reimbursements.schema";
import dayjs from "dayjs";

const fieldLabels: Record<keyof CreateReimbursementInput, string> = {
  value: "Valor",
  description: "Descrição",
  categoryId: "Categoria",
  expenseDate: "Data da despesa",
};

const formatAuditValue = (
  key: string,
  value: any,
  categoryName?: string,
): string => {
  if (value === null || value === undefined || value === "") return "vazio";

  if (key === "value") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
  }

  if (key === "expenseDate") {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
  }

  if (key === "categoryId" && categoryName) {
    return `"${categoryName}"`;
  }

  return `"${value}"`;
};

export const generateUpdateObservation = (
  oldData: Reimbursement & { category?: { name: string } | null },
  newData: Partial<CreateReimbursementInput>,
  newCategoryName?: string,
): string => {
  const changes: string[] = [];
  const keys = Object.keys(newData) as Array<keyof CreateReimbursementInput>;

  for (const key of keys) {
    const newValue = newData[key];
    const oldValue = oldData[key as keyof Reimbursement];

    let hasChanged = false;

    if (key === "expenseDate" && newValue) {
      hasChanged = !dayjs(oldValue as Date).isSame(
        dayjs(newValue as Date),
        "day",
      );
    } else {
      hasChanged = newValue !== undefined && newValue !== oldValue;
    }

    if (hasChanged) {
      const label = fieldLabels[key] || key;

      const formattedOld =
        key === "categoryId"
          ? formatAuditValue(key, oldValue, oldData.category?.name)
          : formatAuditValue(key, oldValue);

      const formattedNew =
        key === "categoryId"
          ? formatAuditValue(key, newValue, newCategoryName)
          : formatAuditValue(key, newValue);

      changes.push(`[${label}]: ${formattedOld} ➔ ${formattedNew}`);
    }
  }

  if (changes.length === 0)
    return "Rascunho atualizado sem alterações nos dados principais.";

  return `${changes.join(" | ")}.`;
};
