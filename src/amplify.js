import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

const redirectUrl = `${window.location.origin}/`;

Amplify.configure({
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    redirectSignIn: redirectUrl,
    redirectSignOut: redirectUrl,
  },
  aws_user_files_s3_bucket: "outponged-post",
  aws_user_files_s3_bucket_region: "us-east-1",
});
