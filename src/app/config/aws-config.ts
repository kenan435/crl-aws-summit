export const awsConfig = {
    Auth: {
      // Note: For unauthenticated access (guest mode), we use Cognito Identity directly
      Cognito: {
        identityPoolId: 'u-central-1:7f908f61-4b65-4610-ba22-8c95c2380c63', // Your Identity Pool ID
        region: 'eu-central-1' // Your region
      }
    },
    Storage: {
      S3: {
        bucket: 'crl-aws-summit-hamburg-files', // Your S3 bucket name
        region: 'eu-central-1' // Your region
      }
    }
  };