package handlers

import (
	"encoding/json"
	"errors"
	"io/fs"
	"net/http"
	"time"

	"github.com/P3rCh1/web-project/backend/internal/logger"
	"github.com/P3rCh1/web-project/backend/internal/server"
)

const ordersFile = "orders.json"

func (h *Handlers) loadOrders() ([]server.Order, error) {
	var orders []server.Order
	if err := readJSON(ordersFile, &orders); err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			return []server.Order{}, nil
		}
		return nil, err
	}
	return orders, nil
}

func (h *Handlers) GetOrders(w http.ResponseWriter, r *http.Request) {
	h.ordersMu.RLock()
	defer h.ordersMu.RUnlock()

	orders, err := h.loadOrders()
	if err != nil {
		logger.Log.Error(
			"failed to get orders list",
			"error", err,
		)
		h.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	h.JSON(w, orders, http.StatusOK)
}

func (h *Handlers) CreateOrder(w http.ResponseWriter, r *http.Request) {
	var req server.CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if len(req.Items) == 0 {
		h.Error(w, "order must contain at least one item", http.StatusBadRequest)
		return
	}
	if req.Phone == "" {
		h.Error(w, "phone is required", http.StatusBadRequest)
		return
	}
	if req.DeliveryType == server.Delivery && (req.Address == nil || *req.Address == "") {
		h.Error(w, "address is required for delivery", http.StatusBadRequest)
		return
	}

	h.ordersMu.Lock()
	defer h.ordersMu.Unlock()

	var goods []server.Product
	if err := readJSON(goodsFile, &goods); err != nil {
		logger.Log.Error(
			"failed to get goods list",
			"error", err,
		)
		h.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	prices := make(map[int]int, len(goods))
	for _, g := range goods {
		prices[g.Id] = g.Price
	}

	order := server.Order{
		Id:    1,
		Date:  time.Now().UTC(),
		Items: req.Items,
	}

	orders, err := h.loadOrders()
	if err != nil {
		logger.Log.Error(
			"failed to get orders list",
			"error", err,
		)
		h.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	for _, o := range orders {
		if o.Id >= order.Id {
			order.Id = o.Id + 1
		}
	}

	for _, item := range req.Items {
		price, ok := prices[item.GoodId]
		if !ok {
			h.Error(w, "unknown good id", http.StatusNotFound)
			return
		}
		order.ItemsCount += item.Quantity
		order.TotalPrice += price * item.Quantity
	}

	orders = append(orders, order)

	if err := writeJSON(ordersFile, orders); err != nil {
		logger.Log.Error(
			"failed to save order",
			"error", err,
		)
		h.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	h.JSON(w, order, http.StatusCreated)
}
