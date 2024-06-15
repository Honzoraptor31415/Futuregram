import { actionWarning } from "$lib/stores/app";
import userDbData from "$lib/stores/userDbData";
import { supabase } from "$lib/supabaseClient";
import type { DbUser } from "$lib/types/db";
import { setNotification } from "./appNotifications";

let currDbUser: DbUser;

userDbData.subscribe((val: any) => {
  currDbUser = val;
});

export function blockUser(uid: string) {
  actionWarning.set({
    heading: "Block this user?",
    text: "Blocking a user makes them unable to see you activity.",
    func: async () => {
      if (currDbUser) {
        setNotification({
          text: "User blocked",
        });

        const { data: currUser } = await supabase
          .from("users")
          .select()
          .eq("id", currDbUser.id)
          .single();
        let currBlocked = currUser.blocked ?? [];
        if (currBlocked.includes(uid)) return;
        currBlocked = [...currBlocked, uid];
        const { error } = await supabase
          .from("users")
          .update({
            blocked: currBlocked,
          })
          .eq("id", currDbUser.id);
      }
    },
    continueBtnText: "Block",
  });
}

export function report(type: string, id: string) {
  console.log("Report function placeholder");
}
