import { Injectable } from "@angular/core";

import { UsersClient } from "./api/pingapp-api.service";
import { UserModalService } from "./user.modal.service";

@Injectable({ providedIn: "root" })
export class UserActionService {

  constructor(
    private readonly usersClient: UsersClient,
    private readonly userModal: UserModalService,
  ) {}

  async select(action: "New"): Promise<void> {
    console.log("1. UserActionService.select called:", action);

    switch (action) {
      case "New": {

        console.log("2. Opening NewUser modal");

        const registerRequest =
          await this.userModal.openNew();

        console.log("3. Modal returned:", registerRequest);

        if (!registerRequest) {
          console.log("4. No request returned - stopping");
          return;
        }

        console.log("5. Calling register");

        this.usersClient.register(registerRequest)
          .subscribe({
            next: () => {
              console.log(
                "6. User created:",
                registerRequest.userName,
              );
            },
            error: (error) => {
              console.error(
                "6. Failed to create user:",
                error,
              );
            },
          });

        break;
      }
    }
  }
}
