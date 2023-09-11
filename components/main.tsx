import RoomsList from "./rooms/rooms-list";
import CreateRoomDialog from "./rooms/create-room-dialog";

export default function Main() {
  return (
    <div className="flex items-center flex-col flex-1 gap-4 max-w-7xl mx-auto">
      <CreateRoomDialog />
      <RoomsList />
    </div>
  );
}
