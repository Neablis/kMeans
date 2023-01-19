import { ChakraProvider, Flex } from '@chakra-ui/react';
import React from 'react';

import Chart from 'components/Chart';

const App: React.FC = () => {
  return (
    <ChakraProvider resetCSS>
      <Flex w="100%" h="80vh" alignItems="center" justifyContent="center">
        <Chart />
      </Flex>
    </ChakraProvider>
  );
};

export default App;
