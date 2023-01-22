import { useState } from "react";
import { useFormspark } from "@formspark/use-formspark";
import { Box, CloseButton, Stack } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";


type Props = {
  nrows: number;
};

export default function FeedbackForm({ nrows }: Props) {
  const [submit, submitting] = useFormspark({
    formId: "qzGbI7Jw",
  });
  const [message, setMessage] = useState("");
  const [hidden, setHidden] = useState(false);
  const { account, chainId } = useEthers();
  return (
    <Box hidden={hidden}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (message !== "") {
            let annotatedMsg = `${message} (from ${account} on chain ${chainId})`
            await submit({ annotatedMsg });
            // console.log(annotatedMsg);
            console.log('Feedback sent!')
            setMessage("");
            setHidden(true);
          }
        }}
      >
        <Stack alignItems="center">
          <CloseButton onClick={() => setHidden(true)} mr={'17rem'} mb={'-1rem'} />
          <label style={{ fontWeight: "900" }}>
            Suggestions? Feature requests?
            <br />
            We'd love to get your feedback!
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={nrows}
            cols={30}
            placeholder={
              "Or be an OG and join our Discord channel to talk to us in real-time!"
            }
          />
          <button type="submit" disabled={submitting}>
            <Box
              mt="0.5rem"
              color="white"
              bg="rgb(187,142,224)"
              width="100%"
              p="0.5rem 1rem"
              borderRadius="1.25rem"
              fontWeight="900"
              _hover={{ bg: "rgb(119,204,255)" }}
            >
              Send Feedback
            </Box>
          </button>
        </Stack>
      </form>
    </Box>
  );
}
