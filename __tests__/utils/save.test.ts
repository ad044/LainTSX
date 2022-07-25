import { upgradeLegacySave } from "@/utils/save";
import legacySaveJson from "@/json/legacy/save.json";
import { GameSite, LegacySaveState } from "@/types";

it("Checks whether legacy saves get updated correctly", () => {
  const res = upgradeLegacySave(legacySaveJson as LegacySaveState);

  const siteASaveState = res.siteSaveState[GameSite.A];
  expect(siteASaveState.level).toEqual(10);
  expect(siteASaveState.siteSegment).toEqual(0);
  expect(siteASaveState.nodeMatrixIndex.row).toEqual(1);
  expect(siteASaveState.nodeMatrixIndex.col).toEqual(0);
  expect(siteASaveState.node?.id).toEqual("1008a");
  expect(siteASaveState.node?.image_table_indices).toEqual([18, null, null]);
  expect(siteASaveState.node?.media_file).toEqual("LAIN09.XA[6]");
  expect(siteASaveState.node?.name).toEqual("Tda040");
  expect(siteASaveState.node?.protocol_lines).toEqual([
    "authorized_il",
    "decoded file:t",
    "ftp/tl.S_server",
  ]);
  expect(siteASaveState.node?.required_final_video_viewcount).toEqual(0);
  expect(siteASaveState.node?.site).toEqual(GameSite.A);
  expect(siteASaveState.node?.title).toEqual("TOUKO's DIARY");
  expect(siteASaveState.node?.triggers_final_video).toEqual(0);
  expect(siteASaveState.node?.type).toEqual(2);
  expect(siteASaveState.node?.unlocked_by).toEqual(null);
  expect(siteASaveState.node?.upgrade_requirement).toEqual(0);
  expect(siteASaveState.node?.words).toEqual([
    "telephone",
    "takeshi",
    "simplicity",
  ]);

  const siteBSaveState = res.siteSaveState[GameSite.B];
  expect(siteBSaveState.level).toEqual(13);
  expect(siteBSaveState.siteSegment).toEqual(4);
  expect(siteBSaveState.nodeMatrixIndex.row).toEqual(0);
  expect(siteBSaveState.nodeMatrixIndex.col).toEqual(0);
  expect(siteBSaveState.node?.id).toEqual("1320b");
  expect(siteBSaveState.node?.image_table_indices).toEqual([556, 557, null]);
  expect(siteBSaveState.node?.media_file).toEqual("LAIN18.XA[7]");
  expect(siteBSaveState.node?.name).toEqual("Lda237");
  expect(siteBSaveState.node?.protocol_lines).toEqual([
    "anonymous_user",
    "active_file:",
    "ftp/tl.L_server",
  ]);
  expect(siteBSaveState.node?.required_final_video_viewcount).toEqual(0);
  expect(siteBSaveState.node?.site).toEqual(GameSite.B);
  expect(siteBSaveState.node?.title).toEqual("lain's DIARY");
  expect(siteBSaveState.node?.triggers_final_video).toEqual(1);
  expect(siteBSaveState.node?.type).toEqual(0);
  expect(siteBSaveState.node?.unlocked_by).toEqual("1300b");
  expect(siteBSaveState.node?.upgrade_requirement).toEqual(5);
  expect(siteBSaveState.node?.words).toEqual([
    "evolution",
    "thought",
    "will&existence",
  ]);

  expect(res.site).toEqual(GameSite.B);
  expect(res.level).toEqual(1);
  expect(res.playerName).toEqual("\u30b1\u30ea\u30b9");
  expect(res.siteSegment).toEqual(7);
  expect(res.nodeMatrixIndex.row).toEqual(0);
  expect(res.nodeMatrixIndex.col).toEqual(0);

  const node = res.node;
  expect(node?.id).toEqual("0123b");
  expect(node?.image_table_indices).toEqual([512, 96, 366]);
  expect(node?.media_file).toEqual("LAIN15.XA[21]");
  expect(node?.name).toEqual("Lda155");
  expect(node?.protocol_lines).toEqual([
    "anonymous_user",
    "active_file:",
    "ftp/tl.L_server",
  ]);
  expect(node?.required_final_video_viewcount).toEqual(0);
  expect(node?.site).toEqual(GameSite.B);
  expect(node?.title).toEqual("lain's DIARY");
  expect(node?.triggers_final_video).toEqual(0);
  expect(node?.type).toEqual(0);
  expect(node?.unlocked_by).toEqual(null);
  expect(node?.upgrade_requirement).toEqual(3);
  expect(node?.words).toEqual(["whereabouts", "father", "proof"]);

  const gameProgress = res.gameProgress;
  expect(gameProgress.sskn_level).toEqual(7);
  expect(gameProgress.gate_level).toEqual(4);
  expect(gameProgress.final_video_viewcount).toEqual(4);
  expect(
    Object.values(gameProgress.polytan_unlocked_parts).every((v) => v)
  ).toEqual(true);
  expect(
    Object.values(gameProgress.nodes).every((v) => v.is_viewed === true)
  ).toEqual(true);
});
