import { openContractCall } from '@stacks/connect';
import {
  stringUtf8CV,
  contractPrincipalCV,
  uintCV,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  createAssetInfo,
  PostConditionMode,
  cvToString,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

// Define contract details
const contractAddress = 'SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY'; // your contract address
const contractName = 'your-contract-name'; // your contract name
const tokenContractName = 'csqd-token'; // CSQD token contract

// Handle minting NFT with CSQD tokens
async function mintNFT(uri) {
  const network = new StacksTestnet(); // Switch to StacksMainnet for mainnet

  const functionArgs = [
    stringUtf8CV(uri)
  ];

  const postConditionAddress = contractAddress;
  const postConditionAmount = 10; // CSQD tokens
  const assetInfo = createAssetInfo(contractAddress, tokenContractName, 'csqd-token');

  const postCondition = makeStandardSTXPostCondition(
    postConditionAddress,
    FungibleConditionCode.Equal,
    postConditionAmount,
    assetInfo
  );

  const options = {
    contractAddress,
    contractName,
    functionName: 'mint-nft-csqd',
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    postConditions: [postCondition],
    network,
    appDetails: {
      name: 'Mint NFT',
      icon: window.location.origin + '/logo.png',
    },
    onFinish: (data) => {
      console.log('NFT minted:', data);
    },
    onCancel: () => {
      console.log('User canceled the transaction');
    },
  };

  await openContractCall(options);
}

// Function to handle form submission
document.getElementById('mint-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const uri = document.getElementById('nft-uri').value;

  if (uri) {
    try {
      await mintNFT(uri);
      document.querySelector('.message').textContent = 'NFT minted successfully!';
    } catch (error) {
      document.querySelector('.message').textContent = 'Error minting NFT: ' + error.message;
    }
  } else {
    document.querySelector('.message').textContent = 'Please provide a valid URI.';
  }
});
