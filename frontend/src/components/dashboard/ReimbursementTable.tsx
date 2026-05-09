import { Box } from "@chakra-ui/react";
import type { Reimbursement } from "../../hooks/useDashboard";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { Role } from "../../interfaces/enum";

interface Props {
  data: Reimbursement[];
  loading: boolean;
  error: string | null;
  role?: string;
  onRetry: () => void;
}

export const ReimbursementsTable = ({
  data,
  loading,
  error,
  role,
  onRetry,
}: Props) => {
  const showUser =
    role === Role.MANAGER || role === Role.FINANCE || role === Role.ADMIN;

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (data.length === 0) return <EmptyState role={role} />;

  return (
    <Box
      bg="rgba(255,255,255,0.02)"
      border="1px solid rgba(255,255,255,0.07)"
      borderRadius="16px"
      overflow="hidden"
      backdropFilter="blur(6px)"
    >
      <Box overflowX="auto">
        <Box as="table" width="100%">
          <TableHeader showUser={showUser} />

          <Box as="tbody">
            {data.map((item, idx) => (
              <TableRow
                key={item.id}
                item={item}
                showUser={showUser}
                isLast={idx === data.length - 1}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
