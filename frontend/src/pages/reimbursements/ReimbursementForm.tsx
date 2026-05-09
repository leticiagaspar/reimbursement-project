import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Textarea,
  Text,
} from "@chakra-ui/react";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "../../components/ui/native-select";
import { useNavigate } from "react-router-dom";
import { FormField, inputStyle } from "../../components/Reimbursement";
import { CategoryService } from "../../services/categoryService";
import type { Category } from "../../interfaces/category";

export interface FormValues {
  description: string;
  value: string;
  expenseDate: string;
  categoryId: string;
}

interface FormErrors {
  description?: string;
  value?: string;
  expenseDate?: string;
  categoryId?: string;
}

interface Props {
  initialValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  submitLabel: string;
  isLoading: boolean;
  serverError?: string;
}

const validate = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.description.trim())
    errors.description = "Descrição é obrigatória.";
  else if (values.description.trim().length < 5)
    errors.description = "Mínimo de 5 caracteres.";

  const numVal = parseFloat(values.value.replace(",", "."));
  if (!values.value) errors.value = "Valor é obrigatório.";
  else if (isNaN(numVal) || numVal <= 0)
    errors.value = "Informe um valor maior que zero.";

  if (values.expenseDate) {
    const selected = new Date(values.expenseDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selected > today) errors.expenseDate = "A data não pode ser futura.";
  } else {
    errors.expenseDate = "Data da despesa é obrigatória.";
  }

  if (!values.categoryId) errors.categoryId = "Selecione uma categoria.";

  return errors;
};

export const ReimbursementForm = ({
  initialValues,
  onSubmit,
  submitLabel,
  isLoading,
  serverError,
}: Props) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<FormValues>({
    description: initialValues?.description ?? "",
    value: initialValues?.value ?? "",
    expenseDate: initialValues?.expenseDate ?? "",
    categoryId: initialValues?.categoryId ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    CategoryService.getAll()
      .then((data) => {
        setCategories(data.filter((c: Category) => c.active !== false));
      })
      .catch(() => {});
  }, []);

  const set = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validate({ ...values, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const blur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(values);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(values).map((k) => [k, true]),
    );
    setTouched(allTouched);

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    await onSubmit(values);
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      aria-label="Formulário de solicitação de reembolso"
    >
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
        <Box gridColumn={{ md: "1 / -1" }}>
          <FormField
            label="Descrição"
            htmlFor="description"
            error={errors.description}
            required
          >
            <Textarea
              id="description"
              {...inputStyle}
              h="auto"
              minH="80px"
              pt={3}
              resize="vertical"
              placeholder="Descreva a despesa detalhadamente…"
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              onBlur={() => blur("description")}
              aria-required="true"
              aria-describedby={errors.description ? "desc-error" : undefined}
              aria-invalid={!!errors.description}
            />
          </FormField>
        </Box>

        <FormField
          label="Valor (R$)"
          htmlFor="value"
          error={errors.value}
          required
        >
          <Input
            id="value"
            type="number"
            step="0.01"
            min="0.01"
            {...inputStyle}
            placeholder="0,00"
            value={values.value}
            onChange={(e) => set("value", e.target.value)}
            onBlur={() => blur("value")}
            aria-required="true"
            aria-invalid={!!errors.value}
          />
        </FormField>

        <FormField
          label="Data da despesa"
          htmlFor="expenseDate"
          error={errors.expenseDate}
          required
        >
          <Input
            id="expenseDate"
            type="date"
            {...inputStyle}
            max={new Date().toISOString().split("T")[0]}
            value={values.expenseDate}
            onChange={(e) => set("expenseDate", e.target.value)}
            onBlur={() => blur("expenseDate")}
            aria-required="true"
            aria-invalid={!!errors.expenseDate}
          />
        </FormField>

        <Box gridColumn={{ md: "1 / -1" }}>
          <FormField
            label="Categoria"
            htmlFor="categoryId"
            error={errors.categoryId}
            required
          >
            <NativeSelectRoot>
              <NativeSelectField
                id="categoryId"
                value={values.categoryId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  set("categoryId", e.target.value)
                }
                onBlur={() => blur("categoryId")}
                aria-required="true"
                aria-invalid={!!errors.categoryId}
                {...inputStyle}
              >
                <option value="" style={{ background: "#0d1f4e" }}>
                  Selecione uma categoria
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    style={{ background: "#0d1f4e" }}
                  >
                    {cat.name}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </FormField>
        </Box>
      </Grid>

      {serverError && (
        <Box
          role="alert"
          mt={5}
          p={4}
          bg="rgba(248,113,113,0.08)"
          border="1px solid rgba(248,113,113,0.25)"
          borderRadius="12px"
        >
          <Text fontSize="13px" color="#f87171">
            {serverError}
          </Text>
        </Box>
      )}

      <Flex gap={3} mt={7} justify="flex-end" flexWrap="wrap">
        <Button
          type="button"
          variant="ghost"
          color="rgba(255,255,255,0.45)"
          borderRadius="10px"
          _hover={{ color: "white", bg: "rgba(255,255,255,0.06)" }}
          onClick={() => navigate(-1)}
          aria-label="Cancelar e voltar"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={isLoading}
          loadingText="Salvando…"
          bg="#10b981"
          color="white"
          borderRadius="10px"
          px={6}
          h="44px"
          fontWeight="600"
          _hover={{ bg: "#059669", transform: "translateY(-1px)" }}
          transition="all 0.2s"
          aria-label={submitLabel}
        >
          {submitLabel}
        </Button>
      </Flex>
    </Box>
  );
};
