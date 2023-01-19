import React, { useState } from "react";
import { useFormspark } from "@formspark/use-formspark";
import { Box, Button, CloseButton, Flex, Stack } from "@chakra-ui/react";

export default function FeedbackForm() {
  const [submit, submitting] = useFormspark({
    formId: "qzGbI7Jw",
  });
  const [message, setMessage] = useState("");
  const [hidden, setHidden] = useState(false);
  return (
    <Box hidden={hidden}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await submit({ message });
          console.log('Feedback sent!')
          setMessage("");
          setHidden(true);
        }}
      >
        <Stack alignItems="center">
          <CloseButton onClick={() => setHidden(true)} position='absolute' left='.3rem' top='.3rem'/>
          <label style={{ fontWeight: "900" }}>
            Suggestions? Feature requests?
            <br />
            We'd love to get your feedback!
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            cols={30}
            placeholder={
              "Or join our Discord channel and talk to us in real-time!"
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
