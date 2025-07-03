import KeySearchForm from "@frontend/feature/search/KeySearchForm";
import KeySearchStateProvider from "@frontend/state/KeySearchStateProvider";

export default async function Page() {
  return (
    <KeySearchStateProvider>
      <KeySearchForm />
    </KeySearchStateProvider>
  );
}
