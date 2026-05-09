import { useState } from "react";
import {
  Button,
  Flex,
  Input,
  Text,
  Badge,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import type { Category } from "../../interfaces/category";

export const CategoryRow = ({
  cat,
  onUpdate,
}: {
  cat: Category;
  onUpdate: (id: string, data: Partial<Category>) => Promise<void>;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(cat.name);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === cat.name) {
      setEditing(false);
      setDraft(cat.name);
      return;
    }
    setSaving(true);
    await onUpdate(cat.id, { name: trimmed });
    setSaving(false);
    setEditing(false);
  };

  return (
    <Grid
      as="article"
      templateColumns={{ base: "1fr", sm: "1fr 100px 170px" }}
      alignItems="center"
      p={4}
      gap={4}
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      _hover={{ bg: "whiteAlpha.50" }}
      transition="background 0.2s"
    >
      <GridItem>
        {editing ? (
          <Flex gap={2}>
            <Input
              size="sm"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
              color="white"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.300"
              _focus={{ borderColor: "green.400", boxShadow: "none" }}
            />
            <Button
              size="sm"
              bg="green.400"
              color="gray.900"
              _hover={{ bg: "green.300" }}
              onClick={handleSave}
              loading={saving}
            >
              Salvar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              color="whiteAlpha.600"
              _hover={{ color: "white", bg: "whiteAlpha.200" }}
              onClick={() => setEditing(false)}
            >
              Cancelar
            </Button>
          </Flex>
        ) : (
          <Text fontSize="sm" fontWeight="medium" color="whiteAlpha.900">
            {cat.name}
          </Text>
        )}
      </GridItem>

      <GridItem justifySelf={{ base: "start", sm: "center" }}>
        <Badge
          bg={cat.active ? "green.900" : "red.900"}
          color={cat.active ? "green.200" : "red.200"}
          px={3}
          py={1}
          borderRadius="full"
          fontSize="10px"
          letterSpacing="wider"
          border="1px solid"
          borderColor={cat.active ? "green.800" : "red.800"}
        >
          {cat.active ? "Ativo" : "Inativo"}
        </Badge>
      </GridItem>

      <GridItem justifySelf={{ base: "start", sm: "end" }}>
        {!editing && (
          <Flex gap={2}>
            <Button
              size="sm"
              variant="ghost"
              color="whiteAlpha.700"
              _hover={{ bg: "whiteAlpha.100", color: "white" }}
              onClick={() => setEditing(true)}
            >
              Editar
            </Button>
            <Button
              size="sm"
              w="90px"
              bg={cat.active ? "transparent" : "green.400"}
              color={cat.active ? "red.300" : "gray.900"}
              border={cat.active ? "1px solid" : "none"}
              borderColor={cat.active ? "red.800" : "transparent"}
              _hover={{
                bg: cat.active ? "red.900" : "green.300",
                borderColor: cat.active ? "red.600" : "transparent",
              }}
              onClick={() => onUpdate(cat.id, { active: !cat.active })}
            >
              {cat.active ? "Desativar" : "Ativar"}
            </Button>
          </Flex>
        )}
      </GridItem>
    </Grid>
  );
};
