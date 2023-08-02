import dynamic from "next/dynamic";
import { IJitsiMeetingProps } from "@jitsi/react-sdk/lib/types";
import { FC } from "react";
import { useQuery } from "@apollo/client";
import { siteGetToken } from "../../../src/shared/apollo/graphql/queries/jitsi/siteGetToken";
import { useRouter } from "next/router";
import { siteGetLessonBySlug } from "../../../src/shared/apollo/graphql/queries/lesson/siteGetLessonBySlug";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { siteGetUserToken } from "../../../src/shared/apollo/graphql/queries/jitsi/siteGetUserToken";
require("./style.less");

const JaaSMeeting = dynamic(
  () =>
    import("@jitsi/react-sdk").then(({ JaaSMeeting }) => JaaSMeeting) as any,
  {
    ssr: false,
  }
) as FC<IJitsiMeetingProps>;

const Conference = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: token, loading } = useQuery(siteGetUserToken, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: { slug: slug && slug[0] },
  });

  const { data: lessonData, loading: lessonLoading } = useQuery(
    siteGetLessonBySlug,
    {
      notifyOnNetworkStatusChange: true,
      // @ts-ignore
      variables: { slug: slug && slug[0] },
      fetchPolicy: "network-only",
    }
  );

  return (
    <>
      {loading && lessonData ? (
        <div className="loading-indicator-center">
          <Spin
            size="large"
            tip="در حال بارگزاری"
            indicator={<LoadingOutlined size={24} rev={undefined} />}
          />
        </div>
      ) : (
        token &&
        token?.getUserToken && (
          <div id="meeting-area">
            <JaaSMeeting
              roomName={`${
                process.env.NEXT_PUBLIC_JITSI_APP_ID +
                "/" +
                lessonData?.lessonApi?.slug
              }`}
              spinner={() => (
                <div className="loading-indicator-center">
                  <Spin
                    size="large"
                    tip="در حال بارگزاری"
                    indicator={<LoadingOutlined size={24} rev={undefined} />}
                  />
                </div>
              )}
              jwt={token?.getUserToken}
              configOverwrite={{
                disableThirdPartyRequests: true,
                disableLocalVideoFlip: true,
                backgroundAlpha: 0.5,
                defaultLanguage: "fa",
                subject: lessonData?.lessonApi?.title,
                disableInviteFunctions: true,
                hiddenPremeetingButtons: ["invite"],
                hideAddRoomButton: true,
                hideEmailInSettings: true,
                toolbarButtons: [
                  "camera",
                  "chat",
                  "desktop",
                  "filmstrip",
                  "fullscreen",
                  "hangup",
                  "help",
                  "highlight",
                  "microphone",
                  "noisesuppression",
                  "participants-pane",
                  "profile",
                  "raisehand",
                  "select-background",
                  "settings",
                  "shortcuts",
                  "stats",
                  "tileview",
                  "toggle-camera",
                  "videoquality",
                  "whiteboard",
                ],
                faceLandmarks: {
                  enableFaceCentering: true,
                },
                participantsPane: {
                  hideModeratorSettingsTab: true,
                  hideMoreActionsButton: true,
                  hideMuteAllButton: true,
                },
              }}
              interfaceConfigOverwrite={{
                VIDEO_LAYOUT_FIT: "nocrop",
                MOBILE_APP_PROMO: false,
                TILE_VIEW_MAX_COLUMNS: 4,
              }}
              getIFrameRef={(iframeRef) => {
                iframeRef.style.height = "100%";
                iframeRef.style.minHeight = "100%";
                iframeRef.style.width = "100%";
              }}
              onReadyToClose={() => {
                router.push("/panel");
              }}
            />
          </div>
        )
      )}
    </>
  );
};

export default Conference;
