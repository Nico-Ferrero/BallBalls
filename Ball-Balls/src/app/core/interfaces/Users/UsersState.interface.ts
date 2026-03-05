import { ProfileResponse } from "./ProfileResponse.interface";

export interface UsersStateInterface {
    isLoading: boolean;
    profile: ProfileResponse | null;
    error: string | null;
}
