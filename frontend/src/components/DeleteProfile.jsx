const DeleteProfile = ({ deleteUser, deletePending }) => {
  return (
    <div className="bg-base-100 shadow rounded-lg px-6 pb-12 pt-10 border border-base-200">
      <h2 className="text-xl font-semibold mb-3">Delete my account</h2>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>
          This will result in the permanent removal of your account and all
          associated data.
        </p>
        <button
          className="flex items-center space-x-1 text-sm bg-red-600 text-white py-2 self-start px-10 rounded-md font-semibold disabled:opacity-50"
          disabled={deletePending}
          onClick={() => {
            if (
              window.confirm("Are you sure you want to delete your account ?")
            ) {
              deleteUser();
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteProfile;
