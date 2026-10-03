import { Injectable } from "@angular/core";

import { UsersClient } from "./api/pingapp-api.service";
import { UserModalService } from "./user.modal.service";
import {firstValueFrom} from 'rxjs';

@Injectable({ providedIn: "root" })
export class UserActionService {


  constructor(
    private readonly usersClient: UsersClient,
    private readonly userModal: UserModalService,
  ) {}

  async select(action: "New" | "Edit" | "Delete"): Promise<boolean> {
    console.log("1. UserActionService.select called:", action);

    switch (action) {
      case "New": {

        console.log("2. Opening NewUser modal");

        const registerRequest =
          await this.userModal.openNew();

        console.log("3. Modal returned:", registerRequest);

        if (!registerRequest) {
          console.log("4. No request returned - stopping");
          return false;
        }



        try {
          await firstValueFrom(
            this.usersClient.register(registerRequest)
          );


          console.log(
            "User created:",
            registerRequest.userName
          );

          return true;



        } catch (error) {
              console.error(
                "Failed to create user:",
                error
              );
              return false;
            }
          }

      case "Edit": {


        console.log("Edit presssed");
        return false;

      }


      case "Delete": {

        console.log("Delete presssed");
        return false;

      }



    }
  }
}
