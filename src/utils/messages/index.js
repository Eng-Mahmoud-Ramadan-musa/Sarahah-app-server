const generateMessage = (entity) => ({

    notFound: `${entity} not found!`,
    createdSuccessfully: `${entity} created successfully.`,
    updatedSuccessfully: `${entity} updated successfully.`,
    deletedSuccessfully: `${entity} deleted successfully.`,
    failToCreate: `fail to create ${entity}!`,
    failToUpdate: `fail to update ${entity}!`,
    failToDelete: `fail to delete ${entity}!`,
})

export const messages = {
    USER: {
        ...generateMessage("user"),
        alreadyExist: "user already exist!",
        loginSuccessfully: "login Successfully.",
        notAuthorized: "Not Authorization Send Message To this User.",
        expiredToken: "expired Token.",
        destroyToken: "destroy token.",
        tokenIsRequired: "token is required",
        loginFirst: "your account is freeze plz login first",
        invalidEmailOrPassword: "invalid email or password",
        mustActiveAccount: "you must active your account first",
        tryToLogin: "try To Login!",
        getProfileSuccessfully: "get profile successfully",
        getUsersSuccessfully: "get users successfully",
        archiveAccount: "archive account successfully",
    },
    MESSAGE: {
        ...generateMessage("message"),
        archiveSuccessfully: 'message archive successfully.',
        restoreSuccessfully: 'message restore successfully.'
    },
    OTP: {
        otpSendSuccessfully: "otp send successfully!",
        invalidOTP: "invalid OTP!",
    }
}