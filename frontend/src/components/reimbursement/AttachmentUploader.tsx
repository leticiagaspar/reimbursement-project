import { useState } from "react";
import { Box, Button, Flex, Text, chakra } from "@chakra-ui/react";
import { ReimbursementService } from "../../services/reimbursementService";

interface AttachmentUploaderProps {
  reimbursementId?: string;
}

export const AttachmentUploader = ({
  reimbursementId,
}: AttachmentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadError, setUploadError] = useState("");

  if (!reimbursementId) return null;

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError("");

    try {
      await ReimbursementService.uploadAttachment(reimbursementId, file);
      setUploaded(true);
      setFile(null);
    } catch (e: any) {
      setUploadError(e?.response?.data?.message ?? "Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      border="1px dashed rgba(255,255,255,0.12)"
      borderRadius="12px"
      p={4}
      mt={2}
    >
      <Text
        fontSize="12px"
        fontWeight="700"
        color="rgba(255,255,255,0.4)"
        letterSpacing="0.06em"
        textTransform="uppercase"
        mb={3}
      >
        Anexo (opcional)
      </Text>
      <Flex gap={3} align="center" flexWrap="wrap">
        <chakra.label
          htmlFor="file-upload"
          cursor="pointer"
          px={4}
          py={2}
          bg="rgba(255,255,255,0.04)"
          border="1px solid rgba(255,255,255,0.1)"
          borderRadius="10px"
          fontSize="13px"
          color="rgba(255,255,255,0.6)"
          _hover={{ bg: "rgba(255,255,255,0.07)", color: "white" }}
          transition="all 0.15s"
        >
          {file ? file.name : "Escolher arquivo"}

          <input
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFile(e.target.files?.[0] ?? null);
              setUploaded(false);
            }}
            aria-label="Selecionar arquivo para anexar (PDF, JPG ou PNG)"
          />
        </chakra.label>
        {file && !uploaded && (
          <Button
            size="sm"
            onClick={handleUpload}
            loading={uploading}
            loadingText="Enviando…"
            bg="rgba(16,185,129,0.15)"
            color="#10b981"
            border="1px solid rgba(16,185,129,0.3)"
            borderRadius="10px"
            _hover={{ bg: "rgba(16,185,129,0.25)" }}
            h="36px"
            aria-label="Enviar arquivo selecionado"
          >
            Enviar
          </Button>
        )}
        {uploaded && (
          <Text fontSize="12px" color="#10b981" fontWeight="600">
            ✓ Anexado com sucesso
          </Text>
        )}
      </Flex>
      {uploadError && (
        <Text role="alert" fontSize="12px" color="#f87171" mt={2}>
          {uploadError}
        </Text>
      )}
      <Text fontSize="11px" color="rgba(255,255,255,0.25)" mt={2}>
        Formatos aceitos: PDF, JPG, PNG
      </Text>
    </Box>
  );
};
