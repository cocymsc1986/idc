import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import App from "./App";

import {
  Error,
  Root,
  Connections,
  AcceptInvitation,
  CreateInvitation,
  Messaging,
  Credentials,
  ESG,
  Discover,
  Connection,
  ReviewKYCPack,
  ReviewESGProof,
  ViewMessages,
  Message,
  SignContent,
  VerifyContent,
  RequestProofs,
  ViewCredentials,
} from "./components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route index element={<Root />} />
      <Route path="connections" element={<Connections />} />
      <Route
        path="connections/accept-invitation"
        element={<AcceptInvitation />}
      />
      <Route
        path="connections/create-invitation"
        element={<CreateInvitation />}
      />
      <Route path="/connections/:connectionId" element={<Connection />} />
      <Route
        path="/connections/:connectionId/review-kyc-pack"
        element={<ReviewKYCPack />}
      />
      <Route
        path="/connections/:connectionId/review-esg-proof"
        element={<ReviewESGProof />}
      />
      <Route
        path="/connections/:connectionId/request-proofs"
        element={<RequestProofs />}
      />
      <Route
        path="/connections/:connectionId/view-messages"
        element={<ViewMessages />}
      />
      <Route path="/connections/:connectionId/message" element={<Message />} />
      <Route
        path="/connections/:connectionId/sign-content"
        element={<SignContent />}
      />
      <Route
        path="/connections/:connectionId/verify-content"
        element={<VerifyContent />}
      />
      <Route
        path="/connections/:connectionId/:presentationId"
        element={<ViewCredentials />}
      />
      <Route path="messaging" element={<Messaging />} />
      <Route path="credentials" element={<Credentials />} />
      <Route path="esg" element={<ESG />} />
      <Route path="discover" element={<Discover />} />
    </Route>
  )
);

const Routes = () => <RouterProvider router={router} />;

export { Routes };
