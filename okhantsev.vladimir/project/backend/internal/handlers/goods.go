package handlers

import (
	"net/http"

	"github.com/P3rCh1/web-project/backend/internal/logger"
	"github.com/P3rCh1/web-project/backend/internal/server"
)

const goodsFile = "goods.json"

func (h *Handlers) GetGoods(w http.ResponseWriter, r *http.Request) {
	var goods []server.Product
	if err := readJSON(goodsFile, &goods); err != nil {
		logger.Log.Error(
			"failed to get goods list",
			"error", err,
		)
		h.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	h.JSON(w, goods, http.StatusOK)
}
