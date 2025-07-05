import { cookies } from "next/headers";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import AppStateProvider from "@frontend/state/AppStateProvider";
import CminiController from "@backend/cmini/controller";
import DefaultLayout from "@frontend/layout/DefaultLayout";
import useAppDefaults from "@frontend/hooks/useAppDefaults";
import { objectFromCookies } from "@util/nextjs";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const corporas = CminiController.getCorpora();
  const appDefaults = await useAppDefaults([
    ["cookies", objectFromCookies(cookieStore, "app")],
  ]);

  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AppStateProvider
              injectedState={{ ...appDefaults.defaultState, corporas }}
            >
              <DefaultLayout>{children}</DefaultLayout>
            </AppStateProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
