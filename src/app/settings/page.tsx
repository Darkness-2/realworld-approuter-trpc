import UpdatePasswordForm from "$/app/settings/UpdatePasswordForm";
import FormPage from "$/components/FormPage";
import { withRequireSession } from "$/components/hocs/withSession";
import { Stack, StackDivider } from "@chakra-ui/react";

function SettingsPage() {
	return (
		<FormPage title="Settings">
			<Stack divider={<StackDivider />} gap={2} w="full">
				<UpdatePasswordForm />
			</Stack>
		</FormPage>
	);
}

export default withRequireSession(SettingsPage, "/auth/login");
