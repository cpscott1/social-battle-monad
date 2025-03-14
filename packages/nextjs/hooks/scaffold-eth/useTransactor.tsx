import { useCallback } from "react";
import { Account, Address, Chain, WalletClient } from "viem";
import { usePublicClient } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";
import { getBlockExplorerTxLink } from "~~/utils/scaffold-eth";

type TransactionFunc = (
  tx: {
    to?: Address;
    value?: bigint;
    account?: Address;
    data?: `0x${string}`;
  },
  options?: {
    onBlockConfirmation?: (txnHash: `0x${string}`) => void;
    blockConfirmations?: number;
  },
) => Promise<`0x${string}`>;

/**
 * Custom notification content for TXs.
 */
const TxnNotification = ({ message, blockExplorerLink }: { message: string; blockExplorerLink?: string }) => {
  return (
    <div className={`flex flex-col ml-1 cursor-default`}>
      <p className="my-0">{message}</p>
      {blockExplorerLink && (
        <a href={blockExplorerLink} target="_blank" rel="noreferrer" className="block link text-md">
          View in Block Explorer
        </a>
      )}
    </div>
  );
};

/**
 * @description Runs a transaction and shows UI feedback.
 * @param walletClient - Wallet client to use for sending the transaction.
 * @param chain - Chain to use for sending the transaction.
 * @returns Function that executes the transaction and shows UI feedback.
 */
export const useTransactor = (walletClient: WalletClient | null, chain?: Chain): TransactionFunc => {
  const publicClient = usePublicClient({ chainId: chain?.id });

  return useCallback(
    async (
      tx: {
        to?: Address;
        value?: bigint;
        account?: Address;
        data?: `0x${string}`;
      },
      options?: {
        onBlockConfirmation?: (txnHash: `0x${string}`) => void;
        blockConfirmations?: number;
      },
    ) => {
      if (!walletClient || !chain) {
        notification.error("Cannot access account");
        throw new Error("Cannot access account");
      }

      let hash: `0x${string}` | undefined;
      const notificationId = notification.loading("Preparing transaction...");

      try {
        hash = await walletClient.sendTransaction({
          to: tx.to,
          value: tx.value,
          data: tx.data,
          account: { address: tx.account } as Account,
          chain,
        });

        notification.remove(notificationId);
        notification.loading(
          <TxnNotification
            message="Transaction Sent"
            blockExplorerLink={hash ? getBlockExplorerTxLink(chain.id, hash) : undefined}
          />,
        );

        if (publicClient) {
          const receipt = await publicClient.waitForTransactionReceipt({
            hash,
            confirmations: options?.blockConfirmations,
          });

          notification.remove();

          notification.success(
            <TxnNotification
              message="Transaction Confirmed"
              blockExplorerLink={getBlockExplorerTxLink(chain.id, receipt.transactionHash)}
            />,
            { duration: 5000 },
          );

          if (options?.onBlockConfirmation) options.onBlockConfirmation(receipt.transactionHash);
        }
      } catch (error) {
        notification.remove(notificationId);
        // Error parsing
        const message = error instanceof Error ? error.message : "Transaction failed";
        notification.error(<TxnNotification message={message} />, { duration: 5000 });
        throw error;
      }

      if (!hash) throw new Error("Transaction failed");
      return hash;
    },
    [chain, publicClient, walletClient],
  );
};
