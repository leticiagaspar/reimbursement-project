import { useEffect, useState } from "react";
import { Flex, Spinner, Text, Box } from "@chakra-ui/react";
import { FileText } from "lucide-react";
import { ReimbursementService } from "../../services/reimbursementService";
import type { Attachment } from "../../interfaces/reimbursement";

interface AttachmentsSectionProps {
  reimbursementId: string;
}

export const AttachmentsSection = ({
  reimbursementId,
}: AttachmentsSectionProps) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ReimbursementService.getAttachments(reimbursementId)
      .then((data) => setAttachments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reimbursementId]);

  if (loading) {
    return (
      <Flex py={4} justify="center" aria-live="polite" aria-busy="true">
        <Spinner size="sm" color="#10b981" />
      </Flex>
    );
  }

  if (attachments.length === 0) {
    return (
      <Text fontSize="13px" color="rgba(255,255,255,0.3)" py={2}>
        Nenhum anexo.
      </Text>
    );
  }

  return (
    <Flex direction="column" gap={2}>
      {attachments.map((att) => (
        <a
          key={att.id}
          href={att.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir anexo: ${att.fileName}`}
          style={{ textDecoration: "none" }}
        >
          <Flex
            align="center"
            gap={3}
            px={4}
            py={3}
            bg="rgba(255,255,255,0.03)"
            border="1px solid rgba(255,255,255,0.07)"
            borderRadius="10px"
            color="rgba(255,255,255,0.6)"
            _hover={{
              color: "white",
              borderColor: "rgba(255,255,255,0.15)",
              bg: "rgba(255,255,255,0.06)",
            }}
            transition="all 0.15s"
          >
            <Box color="#10b981">
              <FileText size={16} strokeWidth={2} />
            </Box>
            <Box flex={1} minW={0}>
              <Text
                fontSize="13px"
                fontWeight="500"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {att.fileName}
              </Text>
              <Text fontSize="11px" color="rgba(255,255,255,0.3)" mt="1px">
                {att.fileType}
              </Text>
            </Box>
            <Text fontSize="11px" color="rgba(255,255,255,0.3)">
              ↗
            </Text>
          </Flex>
        </a>
      ))}
    </Flex>
  );
};
