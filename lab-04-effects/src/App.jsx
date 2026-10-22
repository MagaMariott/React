import { useEffect, useState } from "react";
import { createItem, deleteItem, getItem, getItemsList, updateItem } from "./api/fakeApi.js";
import ItemDetail from "./components/ItemDetail.jsx";
import ItemForm from "./components/ItemForm.jsx";
import ItemList from "./components/ItemList.jsx";

const blank = {
  name: "",
  description: "",
  role: "Prop",
  bay: "",
  condition: "Good",
  keeper: "",
  status: "available",
  acquired: "",
  note: "",
};

export default function App() {
  const [items, setItems] = useState([]);
  const [listStatus, setListStatus] = useState("loading");
  const [listError, setListError] = useState("");
  const [listNonce, setListNonce] = useState(0);

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailStatus, setDetailStatus] = useState("idle");
  const [detailError, setDetailError] = useState("");
  const [detailNonce, setDetailNonce] = useState(0);

  const [formMode, setFormMode] = useState(null);
  const [formError, setFormError] = useState("");
  const [formPending, setFormPending] = useState(false);

  const [pendingId, setPendingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;
    setListError("");
    setListStatus((current) => (current === "ready" || current === "refreshing" ? "refreshing" : "loading"));

    getItemsList("?limit=50")
      .then((result) => {
        if (!active) return;
        setItems(result.data);
        setListStatus("ready");
        setSelectedId((current) =>
          current != null && result.data.some((item) => item.id === current) ? current : null,
        );
      })
      .catch((error) => {
        if (!active) return;
        setListError(error.message);
        setListStatus("error");
      });

    return () => {
      active = false;
    };
  }, [listNonce]);

  useEffect(() => {
    if (selectedId == null) {
      setDetail(null);
      setDetailError("");
      setDetailStatus("idle");
      return;
    }

    let active = true;
    setDetail(null);
    setDetailError("");
    setDetailStatus("loading");

    getItem(selectedId)
      .then((item) => {
        if (!active) return;
        setDetail(item);
        setDetailStatus("ready");
      })
      .catch((error) => {
        if (!active) return;
        setDetail(null);
        setDetailError(error.message);
        setDetailStatus("error");
      });

    return () => {
      active = false;
    };
  }, [selectedId, detailNonce]);

  function selectItem(id) {
    setFormMode(null);
    setFormError("");
    setActionError("");
    setSelectedId(id);
  }

  function openCreate() {
    setFormMode("create");
    setFormError("");
  }

  function openEdit() {
    if (!detail) return;
    setFormMode("edit");
    setFormError("");
  }

  function closeForm() {
    if (formPending) return;
    setFormMode(null);
    setFormError("");
  }

  function saveItem(draft) {
    if (formPending) return;
    setFormPending(true);
    setFormError("");

    const request =
      formMode === "edit" && detail
        ? updateItem(detail.id, draft)
        : createItem(draft);

    request
      .then((saved) => {
        setFormPending(false);
        setFormMode(null);
        setSelectedId(saved.id);
        setDetailNonce((value) => value + 1);
        setListNonce((value) => value + 1);
      })
      .catch((error) => {
        setFormPending(false);
        setFormError(error.message);
      });
  }

  function removeSelected() {
    if (!detail || formPending || pendingId != null) return;
    const itemId = detail.id;
    setFormPending(true);
    setActionError("");

    deleteItem(itemId)
      .then(() => {
        setFormPending(false);
        setSelectedId(null);
        setDetail(null);
        setDetailStatus("idle");
        setListNonce((value) => value + 1);
      })
      .catch((error) => {
        setFormPending(false);
        setActionError(error.message);
      });
  }

  function changeStatus(nextStatus) {
    if (!detail || pendingId != null) return;
    const itemId = detail.id;
    setPendingId(itemId);
    setActionError("");

    updateItem(itemId, { status: nextStatus })
      .then((updated) => {
        setItems((list) => list.map((item) => (item.id === itemId ? { ...item, status: updated.status } : item)));
        setDetail((current) => (current && current.id === itemId ? updated : current));
        setPendingId((current) => (current === itemId ? null : current));
      })
      .catch((error) => {
        setActionError(error.message);
        setPendingId((current) => (current === itemId ? null : current));
      });
  }

  const formInitial = formMode === "edit" && detail ? detail : blank;

  return (
    <>
      <header className="top">
        <p className="eyebrow">Homework 04 · Effects and API</p>
        <h1>Cage ledger</h1>
        <p className="lede">
          Props and lights for the hall. The list and each record load on their own,
          through a simulated API with delay and the occasional error.
        </p>
      </header>
      <main>
        <ItemList
          items={items}
          selectedId={selectedId}
          status={listStatus}
          error={listError}
          onSelect={selectItem}
          onReload={() => setListNonce((value) => value + 1)}
          onCreate={openCreate}
          onRetry={() => setListNonce((value) => value + 1)}
        />
        <section className="stage">
          {formMode ? (
            <ItemForm
              key={`${formMode}-${formInitial.id || "new"}`}
              mode={formMode}
              initial={formInitial}
              pending={formPending}
              error={formError}
              onCancel={closeForm}
              onSubmit={saveItem}
            />
          ) : (
            <ItemDetail
              status={detailStatus}
              item={detail}
              error={detailError}
              pending={pendingId != null}
              pendingHere={detail != null && pendingId === detail.id}
              actionError={actionError}
              onRetry={() => setDetailNonce((value) => value + 1)}
              onEdit={openEdit}
              onRemove={removeSelected}
              onStatus={changeStatus}
            />
          )}
        </section>
      </main>
    </>
  );
}
