import { useSearchParams } from 'react-router-dom';
import EditSoftware from './EditSoftwareForm';
import trpcReact from '../../utils/trpc';

function AddSoftwareSetting() {
  const [searchParams] = useSearchParams();
  const softwareKey = searchParams.get('softwareKey');
  const utils = trpcReact.useContext();
  const softwareShortcuts = utils.software.all.getData();

  return (
    <EditSoftware
      softwareShortcut={softwareShortcuts?.find(
        (s) => s.software.key === softwareKey
      )}
    />
  );
}

export default AddSoftwareSetting;
